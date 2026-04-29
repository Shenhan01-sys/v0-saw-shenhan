export interface PatientData {
  // Demographic
  age: number;
  sex: '0' | '1'; // 0=Female, 1=Male
  patientName: string;

  // Clinical Metrics
  cp: '1' | '2' | '3' | '4'; // Chest pain type
  trestbps: number; // Resting blood pressure (mmHg)
  chol: number; // Serum cholesterol (mg/dl)
  fbs: '0' | '1'; // Fasting blood sugar > 120 mg/dl
  restecg: '0' | '1' | '2'; // Resting ECG
  thalach: number; // Max heart rate achieved (bpm)
  exang: '0' | '1'; // Exercise induced angina
  oldpeak: number; // ST depression
  slope: '1' | '2' | '3'; // ST segment slope
  ca: '0' | '1' | '2' | '3'; // Number of major vessels
  thal: '1' | '2' | '3'; // Thalassemia status

  // Additional Health Metrics
  bmi: number; // Body Mass Index
  sleep: number; // Average sleep hours per night
}

export interface AssessmentResult {
  riskScore: number; // 0-1 scale
  riskCategory: 'LOW' | 'MODERATE' | 'HIGH' | 'VERY_HIGH';
  stageOneScore: number;
  stageTwoScore: number;
  featureContributions: {
    feature: string;
    normalizedValue: number;
    weight: number;
    contribution: number;
  }[];
  normalizationDetails: {
    [key: string]: {
      rawValue: number;
      normalizedValue: number;
      type: 'benefit' | 'cost' | 'sweetSpot';
    };
  };
}

export interface AssessmentRecord extends PatientData {
  id: string;
  date: string; // ISO 8601
  riskScore: number;
  riskCategory: 'LOW' | 'MODERATE' | 'HIGH' | 'VERY_HIGH';
  fullResult: AssessmentResult;
}

export interface FeatureMetadata {
  name: string;
  displayName: string;
  unit: string;
  type: 'benefit' | 'cost' | 'sweetSpot';
  range: {
    min: number;
    max: number;
  };
  sweetSpot?: {
    min: number;
    max: number;
  };
  description: string;
  options?: {
    value: string;
    label: string;
  }[];
}
