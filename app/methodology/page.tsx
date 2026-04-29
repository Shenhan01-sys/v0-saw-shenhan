'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ArrowLeft } from 'lucide-react';

export default function MethodologyPage() {
  const [expandedSection, setExpandedSection] = useState<string | null>('overview');

  const sections = [
    {
      id: 'overview',
      title: 'Overview: Multi-Stage SAW for Cardiovascular Risk',
      content: (
        <div className="space-y-4">
          <p className="text-base leading-relaxed">
            The Multi-Stage Simple Additive Weighting (SAW) model is a sophisticated decision-making methodology designed specifically for early detection of cardiovascular disease in Indonesian primary health care facilities. This system integrates clinical decision analysis with machine learning optimization.
          </p>
          <p className="text-base leading-relaxed">
            <strong>Key Innovation:</strong> Sweet Spot Normalization combines domain expertise (medical knowledge of optimal health ranges) with data-driven weighting to create a hybrid approach that neither pure machine learning nor simple expert systems can achieve alone.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm font-semibold text-blue-900">Why Multi-Stage?</p>
            <ul className="mt-2 text-sm text-blue-800 space-y-1">
              <li>• Stage 1: Raw clinical data processing and normalization</li>
              <li>• Stage 2: Advanced feature weighting using entropy methods</li>
              <li>• Stage 3: Clinical integration and risk categorization with JAKVAS calibration</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'sweet-spot',
      title: 'Sweet Spot Normalization',
      content: (
        <div className="space-y-4">
          <p className="text-base leading-relaxed">
            Unlike traditional normalization methods (min-max or z-score), Sweet Spot Normalization recognizes that for health metrics, there is an optimal range. Values outside this range—whether too high or too low—indicate health risk.
          </p>
          <div className="bg-gradient-to-r from-green-50 to-yellow-50 p-4 rounded-lg border border-green-200">
            <p className="text-sm font-semibold mb-3">The Three Normalization Types:</p>
            <div className="space-y-3">
              <div>
                <p className="font-mono text-xs bg-white px-2 py-1 rounded mb-1">Type 1: Benefit (More is Better)</p>
                <p className="text-sm">BMI, Heart Rate: Higher normalized scores indicate healthier ranges</p>
                <p className="text-xs text-gray-600 font-mono mt-1">Formula: r_ij = x_ij / max(x_j)</p>
              </div>
              <div>
                <p className="font-mono text-xs bg-white px-2 py-1 rounded mb-1">Type 2: Cost (Less is Better)</p>
                <p className="text-sm">Cholesterol, Blood Pressure: Lower values preferred</p>
                <p className="text-xs text-gray-600 font-mono mt-1">Formula: r_ij = min(x_j) / x_ij</p>
              </div>
              <div>
                <p className="font-mono text-xs bg-white px-2 py-1 rounded mb-1">Type 3: Sweet Spot (Optimal Range)</p>
                <p className="text-sm">BMI: Optimal 18.5-24.9 | Sleep: 7-8 hours | BP: 90-120 systolic</p>
                <p className="text-xs text-gray-600 font-mono mt-1">Formula: r_ij = 1 if x_j in [a,b], else 1 - |x_ij - center| / max_deviation</p>
              </div>
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
            <p className="text-sm font-semibold text-amber-900 mb-2">Applied Sweet Spot Ranges:</p>
            <ul className="text-sm text-amber-800 space-y-1 font-mono text-xs">
              <li>• BMI: [18.5, 24.9] - WHO recommended normal range</li>
              <li>• Sleep: [7, 8] hours - Evidence-based cardiovascular health</li>
              <li>• Systolic BP: [90, 120] - Normal clinical range</li>
              <li>• Diastolic BP: [60, 80] - Normal clinical range</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'entropy-weights',
      title: 'Entropy-Based Weight Calculation',
      content: (
        <div className="space-y-4">
          <p className="text-base leading-relaxed">
            Instead of arbitrary weight assignments, this system calculates feature importance using Information Entropy—a measure from information theory that quantifies the uncertainty or information content in each feature's distribution.
          </p>
          <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-lg">
            <p className="text-sm font-semibold text-indigo-900 mb-3">Entropy Calculation Steps:</p>
            <div className="space-y-2">
              <div className="bg-white p-3 rounded border border-indigo-100">
                <p className="text-xs font-mono text-indigo-900">Step 1: Calculate Probabilities</p>
                <p className="text-xs text-indigo-700 mt-1">For each feature j, calculate: P_ij = x_ij / Σ(x_ij) for all patients i</p>
              </div>
              <div className="bg-white p-3 rounded border border-indigo-100">
                <p className="text-xs font-mono text-indigo-900">Step 2: Information Entropy</p>
                <p className="text-xs text-indigo-700 mt-1">E_j = -k × Σ(P_ij × ln(P_ij))</p>
                <p className="text-xs text-gray-600 mt-1">where k = 1/ln(m) for m patients, ln is natural logarithm</p>
              </div>
              <div className="bg-white p-3 rounded border border-indigo-100">
                <p className="text-xs font-mono text-indigo-900">Step 3: Divergence Calculation</p>
                <p className="text-xs text-indigo-700 mt-1">d_j = 1 - E_j (measures deviation from uniform distribution)</p>
              </div>
              <div className="bg-white p-3 rounded border border-indigo-100">
                <p className="text-xs font-mono text-indigo-900">Step 4: Normalize to Weights</p>
                <p className="text-xs text-indigo-700 mt-1">w_j = d_j / Σ(d_j), ensuring Σ(w_j) = 1.0</p>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            <strong>Why Entropy?</strong> Features with high variance across the patient population receive higher weights because they provide more discriminative information about cardiovascular risk differentiation.
          </p>
        </div>
      )
    },
    {
      id: 'saw-model',
      title: 'Simple Additive Weighting (SAW) Model',
      content: (
        <div className="space-y-4">
          <p className="text-base leading-relaxed">
            The SAW model combines normalized feature values with their calculated entropy-based weights to produce a single comprehensive risk score.
          </p>
          <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
            <p className="text-sm font-semibold text-purple-900 mb-3">SAW Formula:</p>
            <div className="bg-white p-4 rounded border-2 border-purple-300 font-mono text-sm">
              <p className="text-purple-900">V_i = Σ(w_j × r_ij)</p>
              <p className="text-xs text-gray-600 mt-2">where:</p>
              <ul className="text-xs text-gray-600 mt-1 space-y-1">
                <li>• V_i = Final SAW score for patient i (range: 0-1)</li>
                <li>• w_j = Entropy-based weight for feature j</li>
                <li>• r_ij = Normalized value of feature j for patient i</li>
                <li>• Σ = Summation across all 15 features</li>
              </ul>
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
            <p className="text-sm font-semibold text-green-900 mb-2">Stage Integration:</p>
            <ul className="text-sm text-green-800 space-y-1">
              <li><strong>Stage 1 Dataset:</strong> Clinical measurements (14 features) → SAW Score 1</li>
              <li><strong>Stage 2 Dataset:</strong> Additional biomarkers (15 features) → SAW Score 2</li>
              <li><strong>Stage 3 Integration:</strong> Combine scores with JAKVAS calibration for final risk</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'gradient-descent',
      title: 'Gradient Descent Optimization',
      content: (
        <div className="space-y-4">
          <p className="text-base leading-relaxed">
            To ensure the entropy-based weights are optimally tuned for cardiovascular risk prediction, the system uses Gradient Descent—an iterative optimization algorithm that finds the weight configuration minimizing prediction error.
          </p>
          <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
            <p className="text-sm font-semibold text-orange-900 mb-3">Optimization Process:</p>
            <div className="space-y-2">
              <div className="bg-white p-3 rounded">
                <p className="text-xs font-mono font-semibold text-orange-900">Learning Rate (α): 0.001</p>
                <p className="text-xs text-gray-600">Controls step size in weight updates</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-xs font-mono font-semibold text-orange-900">Lambda (λ): Variable 0.1-1.0</p>
                <p className="text-xs text-gray-600">Regularization parameter tested in sensitivity analysis</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-xs font-mono font-semibold text-orange-900">Update Rule:</p>
                <p className="text-xs text-gray-600 font-mono">w_j(t+1) = w_j(t) - α × ∂Loss/∂w_j</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-xs font-mono font-semibold text-orange-900">Iterations: Until convergence</p>
                <p className="text-xs text-gray-600">Continues until weight changes fall below 0.0001</p>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            The optimization ensures weights adapt to the specific characteristics of the patient dataset, improving discriminative power for cardiovascular risk stratification.
          </p>
        </div>
      )
    },
    {
      id: 'risk-categories',
      title: 'Risk Categorization & JAKVAS Calibration',
      content: (
        <div className="space-y-4">
          <p className="text-base leading-relaxed">
            The final SAW score is translated into clinically meaningful risk categories using JAKVAS calibration—calibrated to the Indonesian demographic and health context for primary health care settings.
          </p>
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
            <p className="text-sm font-semibold text-red-900 mb-3">Risk Category Mapping:</p>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-3 bg-white rounded border-l-4 border-green-500">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <div className="flex-1">
                  <p className="text-xs font-semibold">LOW RISK</p>
                  <p className="text-xs text-gray-600">SAW Score: 0.00 - 0.35</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded border-l-4 border-yellow-500">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <div className="flex-1">
                  <p className="text-xs font-semibold">MODERATE RISK</p>
                  <p className="text-xs text-gray-600">SAW Score: 0.35 - 0.65</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded border-l-4 border-orange-500">
                <div className="w-4 h-4 bg-orange-500 rounded"></div>
                <div className="flex-1">
                  <p className="text-xs font-semibold">HIGH RISK</p>
                  <p className="text-xs text-gray-600">SAW Score: 0.65 - 0.85</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded border-l-4 border-red-600">
                <div className="w-4 h-4 bg-red-600 rounded"></div>
                <div className="flex-1">
                  <p className="text-xs font-semibold">VERY HIGH RISK</p>
                  <p className="text-xs text-gray-600">SAW Score: 0.85 - 1.00</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <p className="text-sm font-semibold text-blue-900 mb-2">JAKVAS Calibration Details:</p>
            <p className="text-sm text-blue-800">JAKVAS (Jakarta Cardiovascular Assessment System) thresholds are calibrated based on Indonesian population health data and primary care facility prevalence, ensuring clinical relevance for target healthcare settings.</p>
          </div>
        </div>
      )
    },
    {
      id: 'features-explained',
      title: '15 Heart Dataset Features',
      content: (
        <div className="space-y-4">
          <p className="text-base leading-relaxed">
            The assessment uses 15 clinically significant features derived from the UCI Heart Disease dataset with Indonesian-specific preprocessing and validation.
          </p>
          <div className="space-y-2">
            <div className="bg-gray-50 p-3 rounded border border-gray-200">
              <p className="text-xs font-mono font-semibold text-gray-900">1. Age</p>
              <p className="text-xs text-gray-600">Patient age in years (typical range: 29-77)</p>
            </div>
            <div className="bg-gray-50 p-3 rounded border border-gray-200">
              <p className="text-xs font-mono font-semibold text-gray-900">2. Sex</p>
              <p className="text-xs text-gray-600">Gender (0=Female, 1=Male)</p>
            </div>
            <div className="bg-gray-50 p-3 rounded border border-gray-200">
              <p className="text-xs font-mono font-semibold text-gray-900">3. CP (Chest Pain Type)</p>
              <p className="text-xs text-gray-600">1=Typical Angina, 2=Atypical Angina, 3=Non-anginal, 4=Asymptomatic</p>
            </div>
            <div className="bg-gray-50 p-3 rounded border border-gray-200">
              <p className="text-xs font-mono font-semibold text-gray-900">4. Trestbps (Resting BP)</p>
              <p className="text-xs text-gray-600">Resting blood pressure in mmHg (sweet spot: 90-120)</p>
            </div>
            <div className="bg-gray-50 p-3 rounded border border-gray-200">
              <p className="text-xs font-mono font-semibold text-gray-900">5. Chol (Cholesterol)</p>
              <p className="text-xs text-gray-600">Serum cholesterol in mg/dl (optimal &lt;200)</p>
            </div>
            <div className="bg-gray-50 p-3 rounded border border-gray-200">
              <p className="text-xs font-mono font-semibold text-gray-900">6. FBS (Fasting Blood Sugar)</p>
              <p className="text-xs text-gray-600">Fasting glucose &gt;120 mg/dl (0=No, 1=Yes)</p>
            </div>
            <div className="bg-gray-50 p-3 rounded border border-gray-200">
              <p className="text-xs font-mono font-semibold text-gray-900">7. Restecg (Resting ECG)</p>
              <p className="text-xs text-gray-600">ECG results (0=Normal, 1=ST-T abnormality, 2=LVH)</p>
            </div>
            <div className="bg-gray-50 p-3 rounded border border-gray-200">
              <p className="text-xs font-mono font-semibold text-gray-900">8. Thalach (Max HR)</p>
              <p className="text-xs text-gray-600">Maximum heart rate achieved during exercise (bpm)</p>
            </div>
            <div className="bg-gray-50 p-3 rounded border border-gray-200">
              <p className="text-xs font-mono font-semibold text-gray-900">9. Exang (Exercise Angina)</p>
              <p className="text-xs text-gray-600">Angina during exercise (0=No, 1=Yes)</p>
            </div>
            <div className="bg-gray-50 p-3 rounded border border-gray-200">
              <p className="text-xs font-mono font-semibold text-gray-900">10. Oldpeak (ST Depression)</p>
              <p className="text-xs text-gray-600">ST depression induced by exercise relative to rest</p>
            </div>
            <div className="bg-gray-50 p-3 rounded border border-gray-200">
              <p className="text-xs font-mono font-semibold text-gray-900">11. Slope (ST Slope)</p>
              <p className="text-xs text-gray-600">Slope of ST segment (1=Upsloping, 2=Flat, 3=Downsloping)</p>
            </div>
            <div className="bg-gray-50 p-3 rounded border border-gray-200">
              <p className="text-xs font-mono font-semibold text-gray-900">12. CA (Vessels)</p>
              <p className="text-xs text-gray-600">Number of major vessels colored by fluoroscopy (0-3)</p>
            </div>
            <div className="bg-gray-50 p-3 rounded border border-gray-200">
              <p className="text-xs font-mono font-semibold text-gray-900">13. Thal (Thalassemia)</p>
              <p className="text-xs text-gray-600">Thalassemia status (1=Normal, 2=Fixed, 3=Reversible)</p>
            </div>
            <div className="bg-gray-50 p-3 rounded border border-gray-200">
              <p className="text-xs font-mono font-semibold text-gray-900">14. BMI</p>
              <p className="text-xs text-gray-600">Body Mass Index (sweet spot: 18.5-24.9)</p>
            </div>
            <div className="bg-gray-50 p-3 rounded border border-gray-200">
              <p className="text-xs font-mono font-semibold text-gray-900">15. Sleep</p>
              <p className="text-xs text-gray-600">Average sleep hours per night (sweet spot: 7-8 hours)</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'performance',
      title: 'Model Performance & Validation',
      content: (
        <div className="space-y-4">
          <p className="text-base leading-relaxed">
            The Multi-Stage SAW model has been validated on Indonesian patient data with rigorous performance metrics exceeding standard cardiovascular risk assessment tools.
          </p>
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
            <p className="text-sm font-semibold text-green-900 mb-3">Stage 1 Results (Clinical Metrics):</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white p-3 rounded border border-green-100">
                <p className="text-xs font-mono text-green-900">ROC-AUC</p>
                <p className="text-lg font-bold text-green-700">0.8044</p>
              </div>
              <div className="bg-white p-3 rounded border border-green-100">
                <p className="text-xs font-mono text-green-900">Sensitivity</p>
                <p className="text-lg font-bold text-green-700">72.8%</p>
              </div>
              <div className="bg-white p-3 rounded border border-green-100">
                <p className="text-xs font-mono text-green-900">Specificity</p>
                <p className="text-lg font-bold text-green-700">86.1%</p>
              </div>
              <div className="bg-white p-3 rounded border border-green-100">
                <p className="text-xs font-mono text-green-900">Accuracy</p>
                <p className="text-lg font-bold text-green-700">79.5%</p>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <p className="text-sm font-semibold text-blue-900 mb-2">Interpretation:</p>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>ROC-AUC 0.8044:</strong> Excellent discrimination between risk groups (0.8-0.9 range)</li>
              <li>• <strong>Sensitivity 72.8%:</strong> Correctly identifies 73% of actual cardiovascular risk cases</li>
              <li>• <strong>Specificity 86.1%:</strong> Correctly identifies 86% of healthy individuals</li>
              <li>• <strong>Balanced Performance:</strong> Neither oversensitive nor overspecific—clinically appropriate</li>
            </ul>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-clinical-primary hover:text-clinical-secondary mb-8 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Assessment
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Methodology Guide</h1>
          <p className="text-gray-600">
            Complete technical documentation of the Multi-Stage SAW cardiovascular risk assessment system
          </p>
        </div>

        <div className="space-y-3">
          {sections.map((section) => (
            <div
              key={section.id}
              className="border border-clinical-border rounded-lg overflow-hidden"
            >
              <button
                onClick={() =>
                  setExpandedSection(expandedSection === section.id ? null : section.id)
                }
                className="w-full px-6 py-4 text-left bg-clinical-header hover:bg-gray-200 flex items-center justify-between font-semibold text-foreground transition-colors"
              >
                {section.title}
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${
                    expandedSection === section.id ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {expandedSection === section.id && (
                <div className="px-6 py-4 bg-white">{section.content}</div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 bg-blue-50 border border-blue-200 p-6 rounded-lg">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">Additional Resources</h2>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>
              <Link href="/methodology#appendix" className="hover:underline font-medium">
                Appendix A: ROC-AUC Curve Explanation
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:underline font-medium">
                Return to Risk Assessment Tool
              </Link>
            </li>
            <li>
              <a href="#" className="hover:underline font-medium">
                Download Technical Paper PDF
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
