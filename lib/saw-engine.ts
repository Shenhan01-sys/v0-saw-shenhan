/**
 * Multi-Stage SAW Cardiovascular Risk Assessment Engine
 * 2-Stage Architecture matching multistage_saw_final_v2.py
 *
 * Stage 1: Heart Dataset (15 features) - Pre-trained weights (ROC-AUC 0.8044)
 * Stage 2: Cardio Dataset (9 features) - Entropy-based weights
 * Integration: V_final = 0.70 * V1 + 0.30 * V2
 * Risk: LOW < 0.25 | MEDIUM 0.25-0.45 | HIGH >= 0.45
 */

// ============================================================================
// PRE-TRAINED WEIGHTS — from stage1_weights.csv (gradient descent, 319k rows)
// ============================================================================
const STAGE1_WEIGHTS: Record<string, number> = {
  AgeCategory:          0.2730399582988608,
  Stroke:               0.10838994366803048,
  DiffWalking:          0.10337369342057248,
  Smoking:              0.08928103984105658,
  SkinCancer:           0.07878382804243568,
  PhysicalHealth:       0.07380989948970998,
  Diabetic:             0.06941688075352313,
  KidneyDisease:        0.06481619061971784,
  Asthma:               0.0422314059577385,
  PhysicalActivity:     0.02404899518464434,
  GenHealth:            0.02382403143263874,
  MentalHealth:         0.01834363472945238,
  BMI_normalized:       0.015574180085851926,
  AlcoholDrinking:      0.012983209417851787,
  SleepTime_normalized: 0.0020831090579153614,
};

// ============================================================================
// ENTROPY WEIGHTS — from stage2_weights.csv (Cardio dataset, 70k rows)
// ============================================================================
const STAGE2_WEIGHTS: Record<string, number> = {
  AlcoholDrinking:        0.31961007593797663,
  Smoking:                0.26558886321159847,
  GlucoseLevel:           0.2133722613057244,
  CholesterolLevel:       0.15725213157619886,
  PhysicalActivity:       0.019113035867189217,
  BMIScale_normalized:    0.009850569161008934,
  BMI_normalized:         0.00890210348581035,
  SystolicBP_normalized:  0.003734017862323881,
  DiastolicBP_normalized: 0.002576941592169288,
};

const LAMBDA1 = 0.70;
const LAMBDA2 = 0.30;

// Risk thresholds calibrated for raw weighted-sum scale
const THRESHOLD_MEDIUM = 0.25;
const THRESHOLD_HIGH   = 0.45;

// ─── Risk Adjustment Factors (Priority 2) ─────────────────────────────────
const FAMILY_HISTORY_MULTIPLIER = 1.15;  // HR = 2.0 per ESC 2021
const STRESS_ELEVATED_MULTIPLIER = 1.08;  // HR = 1.3-1.5 per Framingham

// ============================================================================
// TYPES
// ============================================================================
export type RiskCategory = 'Low' | 'Moderate' | 'High';

export interface PatientData {
  // ─── Stage 1: Heart Dataset Features (15) ─────────────────────────────────
  ageCategory: number;     // 1–13  (1=18-24y, 2=25-29y, ..., 13=80+y)
  smoking: 0 | 1;          // 1=smoker
  alcoholDrinking: 0 | 1;  // 1=drinks alcohol
  stroke: 0 | 1;           // 1=had stroke
  physicalHealth: number;  // 0–30 days poor physical health last month
  mentalHealth: number;    // 0–30 days poor mental health last month
  diffWalking: 0 | 1;      // 1=difficulty walking/stairs
  diabetic: 0 | 1;         // 1=diabetic
  physicalActivity: 0 | 1; // 1=physically active (exercise outside work)
  genHealth: number;       // 1=Poor, 2=Fair, 3=Good, 4=Very Good, 5=Excellent
  asthma: 0 | 1;           // 1=has asthma
  kidneyDisease: 0 | 1;    // 1=has kidney disease
  skinCancer: 0 | 1;       // 1=has skin cancer
  bmi: number;             // Body Mass Index (kg/m²)
  sleepTime: number;       // Average sleep hours per night

  // ─── Stage 2: Cardio Dataset Features (additional) ────────────────────────
  systolicBP: number;      // Systolic blood pressure (mmHg)
  diastolicBP: number;     // Diastolic blood pressure (mmHg)
  cholesterol: 1 | 2 | 3; // 1=Normal, 2=Above Normal, 3=Well Above Normal
  glucose: 1 | 2 | 3;     // 1=Normal, 2=Above Normal, 3=Well Above Normal

  // ─── Priority 2: Risk-Enhancing Factors (optional) ──────────────────────
  familyHistory?: 'yes' | 'no' | 'unknown';  // Family Hx of premature CVD
  stressScore?: number[];  // [0-4, 0-4] stress assessment responses
}

export interface AssessmentResult {
  v1Score: number;           // Stage 1 SAW score [0,1]
  v2Score: number;           // Stage 2 SAW score [0,1]
  vFinalRaw: number;         // V_final before adjustments [0,1]
  vFinal: number;            // V_final after adjustments [0,1]
  riskCategory: RiskCategory;
  riskPercentage: number;    // vFinal * 100
  stage1Features: FeatureScore[];
  stage2Features: FeatureScore[];
  adjustmentFactors?: {
    familyHistoryApplied: boolean;
    familyHistoryMultiplier: number;
    stressElevated: boolean;
    stressMultiplier: number;
  };
}

export interface FeatureScore {
  feature: string;
  displayName: string;
  rawValue: number | string;
  numericRaw: number;          // actual number fed into normalization formula
  normalizedValue: number;
  weight: number;
  contribution: number;
  normType: 'MinMax' | 'Binary' | 'SweetSpot' | 'Ordinal';
}

export interface AssessmentResult {
  v1Score: number;           // Stage 1 SAW score [0,1]
  v2Score: number;           // Stage 2 SAW score [0,1]
  vFinal: number;            // Integrated score [0,1]
  riskCategory: RiskCategory;
  riskPercentage: number;    // vFinal * 100
  stage1Features: FeatureScore[];
  stage2Features: FeatureScore[];
}

// ============================================================================
// SWEET SPOT NORMALIZATION
// Research formula (Slide_06_Normalisasi_SAW.md):
//   x < L  →  r = 1 − (L − x)/(L − min)
//   L ≤ x ≤ U  →  r = 1.0
//   x > U  →  r = 1 − (x − U)/(max − U)
// Returns a HEALTH SCORE: 1.0 = optimal, lower = worse
// ============================================================================
function sweetSpot(
  value: number,
  lower: number,
  upper: number,
  min: number,
  max: number
): number {
  if (value >= lower && value <= upper) return 1.0;
  if (value < lower) {
    const penalty = (lower - value) / (lower - min);
    return Math.max(0, 1.0 - penalty);
  }
  const penalty = (value - upper) / (max - upper);
  return Math.max(0, 1.0 - penalty);
}

// ============================================================================
// BMI SCALE (1–10 discretization)
// ============================================================================
function getBMIScale(bmi: number): number {
  if (bmi < 15)   return 1;
  if (bmi < 18.5) return 2;
  if (bmi < 21)   return 3;
  if (bmi < 24.9) return 4;
  if (bmi < 27.5) return 5;
  if (bmi < 30)   return 6;
  if (bmi < 32.5) return 7;
  if (bmi < 35)   return 8;
  if (bmi < 40)   return 9;
  return 10;
}

// ============================================================================
// AGE → AGE CATEGORY (BRFSS 2020 mapping)
// ============================================================================
export function ageToCategory(age: number): number {
  if (age < 25)  return 1;
  if (age < 30)  return 2;
  if (age < 35)  return 3;
  if (age < 40)  return 4;
  if (age < 45)  return 5;
  if (age < 50)  return 6;
  if (age < 55)  return 7;
  if (age < 60)  return 8;
  if (age < 65)  return 9;
  if (age < 70)  return 10;
  if (age < 75)  return 11;
  if (age < 80)  return 12;
  return 13;
}

// ============================================================================
// STAGE 1 NORMALIZATION
// Convention matches multistage_saw_final_v2.py:
//   - Binary {0,1}: kept as-is  (Smoking=1 → high contribution = more risk)
//   - Ordinal/continuous: standard min-max  (older age → higher value → more risk)
//   - BMI/SleepTime: sweet spot (in range = 1.0, outside = penalty)
//   - GenHealth inverted: Poor=1→r=1.0, Excellent=5→r=0.0 (risk direction)
// ============================================================================
function normalizeStage1(p: PatientData): Record<string, number> {
  const bmiNorm   = sweetSpot(p.bmi,       18.5, 24.9, 10, 80);
  const sleepNorm = sweetSpot(p.sleepTime,  7,    8,    1,  24);

  // GenHealth risk direction: Poor(1)→1.0 means more risk, Excellent(5)→0.0 means healthy
  // Formula: (5 - value) / 4
  const genHealthRisk = Math.max(0, Math.min(1, (5 - p.genHealth) / 4));

  return {
    AgeCategory:          (p.ageCategory - 1) / 12,  // [1,13] → [0,1]
    Stroke:               p.stroke,
    DiffWalking:          p.diffWalking,
    Smoking:              p.smoking,
    SkinCancer:           p.skinCancer,
    PhysicalHealth:       p.physicalHealth / 30,
    Diabetic:             p.diabetic,
    KidneyDisease:        p.kidneyDisease,
    Asthma:               p.asthma,
    PhysicalActivity:     p.physicalActivity,
    GenHealth:            genHealthRisk,
    MentalHealth:         p.mentalHealth / 30,
    BMI_normalized:       bmiNorm,
    AlcoholDrinking:      p.alcoholDrinking,
    SleepTime_normalized: sleepNorm,
  };
}

// ============================================================================
// STAGE 2 NORMALIZATION
// Convention matches multistage_saw_final_v2.py:
//   - Binary: as-is
//   - Cholesterol/Glucose (1–3): (value-1)/2
//   - BMI/BMIScale/BP: sweet spot
// ============================================================================
function normalizeStage2(p: PatientData): Record<string, number> {
  const bmiNorm      = sweetSpot(p.bmi,        18.5, 24.9, 10, 80);
  const bmiScale     = getBMIScale(p.bmi);
  const bmiScaleNorm = sweetSpot(bmiScale,     3,    4,    1,  10);
  const sbpNorm      = sweetSpot(p.systolicBP, 90,   120,  70, 200);
  const dbpNorm      = sweetSpot(p.diastolicBP,60,   80,   40, 130);

  return {
    Smoking:               p.smoking,
    AlcoholDrinking:       p.alcoholDrinking,
    PhysicalActivity:      p.physicalActivity,
    CholesterolLevel:      (p.cholesterol - 1) / 2,  // [1,3] → [0,1]
    GlucoseLevel:          (p.glucose     - 1) / 2,  // [1,3] → [0,1]
    BMI_normalized:        bmiNorm,
    BMIScale_normalized:   bmiScaleNorm,
    SystolicBP_normalized: sbpNorm,
    DiastolicBP_normalized: dbpNorm,
  };
}

// ============================================================================
// SAW SCORE  V = Σ(w_j × r_ij)
// ============================================================================
function sawScore(
  features: Record<string, number>,
  weights: Record<string, number>
): number {
  let score = 0;
  for (const [feat, w] of Object.entries(weights)) {
    score += w * (features[feat] ?? 0);
  }
  return Math.max(0, Math.min(1, score));
}

// ============================================================================
// DISPLAY NAMES FOR FEATURE TABLE
// ============================================================================
const STAGE1_DISPLAY: Record<string, string> = {
  AgeCategory:          'Age Category',
  Stroke:               'Stroke History',
  DiffWalking:          'Difficulty Walking',
  Smoking:              'Smoking',
  SkinCancer:           'Skin Cancer',
  PhysicalHealth:       'Physical Health (sick days)',
  Diabetic:             'Diabetic',
  KidneyDisease:        'Kidney Disease',
  Asthma:               'Asthma',
  PhysicalActivity:     'Physical Activity',
  GenHealth:            'General Health (risk)',
  MentalHealth:         'Mental Health (sick days)',
  BMI_normalized:       'BMI (sweet spot)',
  AlcoholDrinking:      'Alcohol Drinking',
  SleepTime_normalized: 'Sleep Time (sweet spot)',
};

const STAGE2_DISPLAY: Record<string, string> = {
  Smoking:               'Smoking',
  AlcoholDrinking:       'Alcohol Drinking',
  PhysicalActivity:      'Physical Activity',
  CholesterolLevel:      'Cholesterol Level',
  GlucoseLevel:          'Glucose Level',
  BMI_normalized:        'BMI (sweet spot)',
  BMIScale_normalized:   'BMI Scale (sweet spot)',
  SystolicBP_normalized: 'Systolic BP (sweet spot)',
  DiastolicBP_normalized:'Diastolic BP (sweet spot)',
};

// ============================================================================
// MAIN ASSESSMENT FUNCTION
// ============================================================================
export function assessCardiovascularRisk(p: PatientData): AssessmentResult {
  // ── Stage 1 ─────────────────────────────────────────────────────────────
  const s1Norm = normalizeStage1(p);
  const v1Score = sawScore(s1Norm, STAGE1_WEIGHTS);

  const stage1Features: FeatureScore[] = Object.entries(STAGE1_WEIGHTS).map(([feat, w]) => {
    const r = s1Norm[feat] ?? 0;
    return {
      feature:         feat,
      displayName:     STAGE1_DISPLAY[feat] ?? feat,
      rawValue:        getRawValue1(feat, p),
      numericRaw:      getNumericRaw1(feat, p),
      normalizedValue: r,
      weight:          w,
      contribution:    w * r,
      normType:        getNormType1(feat),
    };
  }).sort((a, b) => b.contribution - a.contribution);

  // ── Stage 2 ─────────────────────────────────────────────────────────────
  const s2Norm = normalizeStage2(p);
  const v2Score = sawScore(s2Norm, STAGE2_WEIGHTS);

  const stage2Features: FeatureScore[] = Object.entries(STAGE2_WEIGHTS).map(([feat, w]) => {
    const r = s2Norm[feat] ?? 0;
    return {
      feature:         feat,
      displayName:     STAGE2_DISPLAY[feat] ?? feat,
      rawValue:        getRawValue2(feat, p),
      numericRaw:      getNumericRaw2(feat, p),
      normalizedValue: r,
      weight:          w,
      contribution:    w * r,
      normType:        getNormType2(feat),
    };
  }).sort((a, b) => b.contribution - a.contribution);

  // ── Integration  V_final = 0.70×V1 + 0.30×V2 ────────────────────────────
  const vFinalRaw = LAMBDA1 * v1Score + LAMBDA2 * v2Score;

  // ── Priority 2: Apply Risk-Enhancing Factor Adjustments ─────────────────
  // These factors are NOT in the original training data, so we apply them as multipliers
  let vFinal = vFinalRaw;
  let familyHistoryApplied = false;
  let familyHistoryMultiplier = 1.0;
  let stressElevated = false;
  let stressMultiplier = 1.0;

  // Family History: positive family Hx → HR = 2.0, approximate as 15% risk increase
  if (p.familyHistory === 'yes') {
    familyHistoryApplied = true;
    familyHistoryMultiplier = FAMILY_HISTORY_MULTIPLIER;
    vFinal = Math.min(1.0, vFinal * FAMILY_HISTORY_MULTIPLIER);
  }

  // Stress Score: elevated (total > 4) → HR ~1.3-1.5, approximate as 8% increase
  if (p.stressScore && p.stressScore.length >= 2) {
    const totalStress = (p.stressScore[0] ?? 0) + (p.stressScore[1] ?? 0);
    if (totalStress > 4) {
      stressElevated = true;
      stressMultiplier = STRESS_ELEVATED_MULTIPLIER;
      vFinal = Math.min(1.0, vFinal * STRESS_ELEVATED_MULTIPLIER);
    }
  }

  // ── Risk Categorization ──────────────────────────────────────────────────
  let riskCategory: RiskCategory;
  if (vFinal < THRESHOLD_MEDIUM) {
    riskCategory = 'Low';
  } else if (vFinal < THRESHOLD_HIGH) {
    riskCategory = 'Moderate';
  } else {
    riskCategory = 'High';
  }

  return {
    v1Score,
    v2Score,
    vFinalRaw,
    vFinal,
    riskCategory,
    riskPercentage: Math.round(vFinal * 100),
    stage1Features,
    stage2Features,
    adjustmentFactors: {
      familyHistoryApplied,
      familyHistoryMultiplier,
      stressElevated,
      stressMultiplier,
    },
  };
}

// ============================================================================
// HELPERS
// ============================================================================
function getRawValue1(feat: string, p: PatientData): number | string {
  switch (feat) {
    case 'AgeCategory':          return `Cat ${p.ageCategory}`;
    case 'Stroke':               return p.stroke ? 'Yes' : 'No';
    case 'DiffWalking':          return p.diffWalking ? 'Yes' : 'No';
    case 'Smoking':              return p.smoking ? 'Yes' : 'No';
    case 'SkinCancer':           return p.skinCancer ? 'Yes' : 'No';
    case 'PhysicalHealth':       return `${p.physicalHealth} days`;
    case 'Diabetic':             return p.diabetic ? 'Yes' : 'No';
    case 'KidneyDisease':        return p.kidneyDisease ? 'Yes' : 'No';
    case 'Asthma':               return p.asthma ? 'Yes' : 'No';
    case 'PhysicalActivity':     return p.physicalActivity ? 'Yes' : 'No';
    case 'GenHealth':            return ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][p.genHealth];
    case 'MentalHealth':         return `${p.mentalHealth} days`;
    case 'BMI_normalized':       return `${p.bmi.toFixed(1)} kg/m²`;
    case 'AlcoholDrinking':      return p.alcoholDrinking ? 'Yes' : 'No';
    case 'SleepTime_normalized': return `${p.sleepTime} hrs`;
    default:                     return '';
  }
}

function getRawValue2(feat: string, p: PatientData): number | string {
  switch (feat) {
    case 'Smoking':               return p.smoking ? 'Yes' : 'No';
    case 'AlcoholDrinking':       return p.alcoholDrinking ? 'Yes' : 'No';
    case 'PhysicalActivity':      return p.physicalActivity ? 'Yes' : 'No';
    case 'CholesterolLevel':      return ['', 'Normal', 'Above Normal', 'Well Above'][p.cholesterol];
    case 'GlucoseLevel':          return ['', 'Normal', 'Above Normal', 'Well Above'][p.glucose];
    case 'BMI_normalized':        return `${p.bmi.toFixed(1)} kg/m²`;
    case 'BMIScale_normalized':   return `Scale ${getBMIScale(p.bmi)}`;
    case 'SystolicBP_normalized': return `${p.systolicBP} mmHg`;
    case 'DiastolicBP_normalized':return `${p.diastolicBP} mmHg`;
    default:                      return '';
  }
}

function getNumericRaw1(feat: string, p: PatientData): number {
  switch (feat) {
    case 'AgeCategory':          return p.ageCategory;
    case 'Stroke':               return p.stroke;
    case 'DiffWalking':          return p.diffWalking;
    case 'Smoking':              return p.smoking;
    case 'SkinCancer':           return p.skinCancer;
    case 'PhysicalHealth':       return p.physicalHealth;
    case 'Diabetic':             return p.diabetic;
    case 'KidneyDisease':        return p.kidneyDisease;
    case 'Asthma':               return p.asthma;
    case 'PhysicalActivity':     return p.physicalActivity;
    case 'GenHealth':            return p.genHealth;
    case 'MentalHealth':         return p.mentalHealth;
    case 'BMI_normalized':       return p.bmi;
    case 'AlcoholDrinking':      return p.alcoholDrinking;
    case 'SleepTime_normalized': return p.sleepTime;
    default:                     return 0;
  }
}

function getNumericRaw2(feat: string, p: PatientData): number {
  switch (feat) {
    case 'Smoking':               return p.smoking;
    case 'AlcoholDrinking':       return p.alcoholDrinking;
    case 'PhysicalActivity':      return p.physicalActivity;
    case 'CholesterolLevel':      return p.cholesterol;
    case 'GlucoseLevel':          return p.glucose;
    case 'BMI_normalized':        return p.bmi;
    case 'BMIScale_normalized':   return getBMIScale(p.bmi);
    case 'SystolicBP_normalized': return p.systolicBP;
    case 'DiastolicBP_normalized':return p.diastolicBP;
    default:                      return 0;
  }
}

function getNormType1(feat: string): FeatureScore['normType'] {
  if (['BMI_normalized', 'SleepTime_normalized'].includes(feat)) return 'SweetSpot';
  if (['Smoking', 'AlcoholDrinking', 'Stroke', 'DiffWalking', 'Diabetic',
       'KidneyDisease', 'Asthma', 'SkinCancer', 'PhysicalActivity'].includes(feat)) return 'Binary';
  if (['GenHealth'].includes(feat)) return 'Ordinal';
  return 'MinMax';
}

function getNormType2(feat: string): FeatureScore['normType'] {
  if (['BMI_normalized', 'BMIScale_normalized', 'SystolicBP_normalized',
       'DiastolicBP_normalized'].includes(feat)) return 'SweetSpot';
  if (['Smoking', 'AlcoholDrinking', 'PhysicalActivity'].includes(feat)) return 'Binary';
  if (['CholesterolLevel', 'GlucoseLevel'].includes(feat)) return 'Ordinal';
  return 'MinMax';
}

// ============================================================================
// UTILITIES
// ============================================================================
export function getRiskColor(cat: RiskCategory): string {
  if (cat === 'Low')      return 'text-green-600';
  if (cat === 'Moderate') return 'text-yellow-600';
  return 'text-red-600';
}

export function getRiskBgColor(cat: RiskCategory): string {
  if (cat === 'Low')      return 'bg-green-50 border-green-200';
  if (cat === 'Moderate') return 'bg-yellow-50 border-yellow-200';
  return 'bg-red-50 border-red-200';
}

export function validatePatientData(data: Partial<PatientData>): string[] {
  const errors: string[] = [];
  if (!data.ageCategory || data.ageCategory < 1 || data.ageCategory > 13)
    errors.push('Age category must be 1–13');
  if (data.bmi !== undefined && (data.bmi < 10 || data.bmi > 80))
    errors.push('BMI must be 10–80 kg/m²');
  if (data.sleepTime !== undefined && (data.sleepTime < 1 || data.sleepTime > 24))
    errors.push('Sleep time must be 1–24 hours');
  if (data.physicalHealth !== undefined && (data.physicalHealth < 0 || data.physicalHealth > 30))
    errors.push('Physical health days must be 0–30');
  if (data.mentalHealth !== undefined && (data.mentalHealth < 0 || data.mentalHealth > 30))
    errors.push('Mental health days must be 0–30');
  if (data.systolicBP !== undefined && (data.systolicBP < 70 || data.systolicBP > 250))
    errors.push('Systolic BP must be 70–250 mmHg');
  if (data.diastolicBP !== undefined && (data.diastolicBP < 40 || data.diastolicBP > 150))
    errors.push('Diastolic BP must be 40–150 mmHg');
  return errors;
}
