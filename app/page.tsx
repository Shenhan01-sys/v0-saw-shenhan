'use client';

import React, { useState } from 'react';
import { PatientForm } from '@/components/patient-form';
import { AssessmentResults } from '@/components/assessment-results';
import { PatientData, assessCardiovascularRisk, AssessmentResult } from '@/lib/saw-engine';
import { Button } from '@/components/ui/button';
import { BookOpen, Home, History } from 'lucide-react';

export default function Page() {
  const [currentPage, setCurrentPage] = useState<'home' | 'assessment' | 'methodology' | 'history'>('home');
  const [assessment, setAssessment] = useState<AssessmentResult | null>(null);
  const [assessmentHistory, setAssessmentHistory] = useState<
    Array<{
      result: AssessmentResult;
      patientData: PatientData;
      timestamp: Date;
    }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAssessment = (patientData: PatientData) => {
    setIsLoading(true);
    // Simulate processing time
    setTimeout(() => {
      const result = assessCardiovascularRisk(patientData);
      setAssessment(result);
      setAssessmentHistory((prev) => [
        {
          result,
          patientData,
          timestamp: new Date(),
        },
        ...prev.slice(0, 9), // Keep last 10 assessments
      ]);
      setCurrentPage('assessment');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header Navigation */}
      <header className="sticky top-0 z-50 bg-white border-b border-clinical-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-to-br from-clinical-primary to-clinical-secondary rounded-lg flex items-center justify-center">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-clinical-primary">JAKVAS-SAW</h1>
                <p className="text-xs text-gray-500">Cardiovascular Risk Assessment System</p>
              </div>
            </div>

            <nav className="flex gap-2">
              <Button
                variant={currentPage === 'home' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentPage('home')}
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Home</span>
              </Button>
              <Button
                variant={currentPage === 'methodology' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentPage('methodology')}
                className="flex items-center gap-2"
              >
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">Methodology</span>
              </Button>
              <Button
                variant={currentPage === 'history' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentPage('history')}
                className="flex items-center gap-2"
              >
                <History className="h-4 w-4" />
                <span className="hidden sm:inline">
                  History {assessmentHistory.length > 0 && `(${assessmentHistory.length})`}
                </span>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Home Page */}
        {currentPage === 'home' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Cardiovascular Risk Assessment</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Multi-Stage SAW (Simple Weighted Additive) Model with Entropy-Based Weighting for
                Early Detection of Cardiovascular Disease in Indonesian Primary Health Care
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="text-3xl font-bold text-clinical-primary mb-2">15</div>
                <p className="font-semibold text-gray-900 mb-1">Clinical Features</p>
                <p className="text-sm text-gray-600">
                  Comprehensive assessment using all Heart dataset parameters
                </p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="text-3xl font-bold text-clinical-primary mb-2">4</div>
                <p className="font-semibold text-gray-900 mb-1">Risk Categories</p>
                <p className="text-sm text-gray-600">
                  Low, Moderate, High, and Very High risk classifications
                </p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="text-3xl font-bold text-clinical-primary mb-2">∞</div>
                <p className="font-semibold text-gray-900 mb-1">Population Calibrated</p>
                <p className="text-sm text-gray-600">
                  JAKVAS calibration for Indonesian population specificity
                </p>
              </div>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-blue-900 mb-3">How It Works</h3>
                <ol className="space-y-2 text-sm text-blue-800">
                  <li>
                    <strong>1. Data Collection:</strong> Enter patient demographics and clinical
                    measurements
                  </li>
                  <li>
                    <strong>2. Normalization:</strong> Apply benefit/cost/sweet-spot normalization to
                    standardize values
                  </li>
                  <li>
                    <strong>3. Weight Calculation:</strong> Use Information Entropy to determine feature
                    importance
                  </li>
                  <li>
                    <strong>4. SAW Scoring:</strong> Calculate weighted sum to produce final risk score
                  </li>
                  <li>
                    <strong>5. Calibration:</strong> Apply JAKVAS and population adjustments for
                    accuracy
                  </li>
                  <li>
                    <strong>6. Categorization:</strong> Assign risk level based on score thresholds
                  </li>
                </ol>
              </div>

              <PatientForm onSubmit={handleAssessment} isLoading={isLoading} />
            </div>
          </div>
        )}

        {/* Assessment Results Page */}
        {currentPage === 'assessment' && assessment && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-900">Assessment Results</h2>
              <Button
                variant="outline"
                onClick={() => setCurrentPage('home')}
                className="flex items-center gap-2"
              >
                New Assessment
              </Button>
            </div>
            <AssessmentResults result={assessment} />
          </div>
        )}

        {/* Methodology Page */}
        {currentPage === 'methodology' && (
          <div className="space-y-8 max-w-4xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Methodology</h2>

            {/* Overview */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Overview</h3>
              <p className="text-gray-700 mb-4">
                This system implements a multi-stage cardiovascular risk assessment framework based
                on the Simple Weighted Additive (SAW) model with entropy-based feature weighting.
                The methodology incorporates JAKVAS (Jakarta Vascular Score) calibration for
                Indonesian population applicability and uses sweet spot normalization for health
                metrics with optimal ranges.
              </p>
            </div>

            {/* Normalization Methods */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Normalization Methods</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-gray-900">Benefit Criterion</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Higher values are better: r_ij = value / max(value)
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Used for: Maximum Heart Rate, Physical Activity, ST Slope
                  </p>
                </div>
                <div className="border-l-4 border-red-500 pl-4">
                  <h4 className="font-semibold text-gray-900">Cost Criterion</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Lower values are better: r_ij = min(value) / value
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Used for: Age, Blood Pressure, Cholesterol, Glucose, ST Depression, Smoking,
                    Diabetes
                  </p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-semibold text-gray-900">Sweet Spot Criterion</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Optimal values within a range: r_ij = 1 if a ≤ value ≤ b, value/a if value {`<`}
                    a, b/value if value {`>`} b
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Used for: BMI [18.5-24.9 kg/m²], Sleep Time [7-8 hours]
                  </p>
                </div>
              </div>
            </div>

            {/* Entropy Weight Calculation */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Entropy-Based Weight Calculation</h3>
              <div className="space-y-3 text-sm text-gray-700">
                <p>
                  The system uses Information Entropy to calculate the relative importance of each
                  feature:
                </p>
                <div className="bg-gray-50 p-4 rounded font-mono text-xs space-y-2">
                  <p>
                    <strong>Step 1 - Calculate Entropy:</strong>
                  </p>
                  <p className="ml-4">E_j = -k × Σ(P_ij × ln(P_ij))</p>
                  <p className="ml-4">where k = 1/ln(m) and m = number of alternatives</p>

                  <p className="mt-3">
                    <strong>Step 2 - Calculate Divergence:</strong>
                  </p>
                  <p className="ml-4">d_j = 1 - E_j</p>

                  <p className="mt-3">
                    <strong>Step 3 - Normalize Weights:</strong>
                  </p>
                  <p className="ml-4">w_j = d_j / Σ(d_j)</p>
                </div>
                <p className="text-gray-600 mt-3">
                  Features with greater discriminatory power (higher divergence) receive higher weights
                  in the final assessment.
                </p>
              </div>
            </div>

            {/* SAW Score Calculation */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">SAW Score Calculation</h3>
              <p className="text-sm text-gray-700 mb-3">
                The final Simple Weighted Additive score is calculated as:
              </p>
              <div className="bg-gray-50 p-4 rounded font-mono text-sm mb-3">
                <p>V = Σ(w_j × r_ij)</p>
                <p className="text-xs text-gray-600 mt-2">
                  where w_j = entropy-based weight for feature j, r_ij = normalized value for feature
                  j
                </p>
              </div>
              <p className="text-sm text-gray-600">
                The score is normalized to [0, 1] and then adjusted using calibration factors for
                population specificity and class imbalance.
              </p>
            </div>

            {/* Calibration */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">JAKVAS Calibration</h3>
              <p className="text-sm text-gray-700 mb-3">
                Jakarta Vascular Score (JAKVAS) calibration adjusts the model for Indonesian
                population characteristics:
              </p>
              <ul className="text-sm text-gray-700 space-y-2 ml-4 list-disc">
                <li>Age-specific risk adjustments based on Indonesian epidemiology</li>
                <li>Gender-specific modifications for cardiovascular risk distribution</li>
                <li>Smoking prevalence adjustments for male populations</li>
                <li>Population subgroup normalization across Indonesian regions</li>
              </ul>
            </div>

            {/* Risk Categories */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Risk Categories</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-green-50 border border-green-200 p-4 rounded">
                  <p className="font-semibold text-green-900">Low Risk</p>
                  <p className="text-sm text-green-800 mt-1">Score: 0.00 - 0.25</p>
                  <p className="text-xs text-gray-600 mt-2">Continue healthy lifestyle habits</p>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
                  <p className="font-semibold text-yellow-900">Moderate Risk</p>
                  <p className="text-sm text-yellow-800 mt-1">Score: 0.25 - 0.50</p>
                  <p className="text-xs text-gray-600 mt-2">Implement preventive measures</p>
                </div>
                <div className="bg-orange-50 border border-orange-200 p-4 rounded">
                  <p className="font-semibold text-orange-900">High Risk</p>
                  <p className="text-sm text-orange-800 mt-1">Score: 0.50 - 0.75</p>
                  <p className="text-xs text-gray-600 mt-2">Consult cardiologist</p>
                </div>
                <div className="bg-red-50 border border-red-200 p-4 rounded">
                  <p className="font-semibold text-red-900">Very High Risk</p>
                  <p className="text-sm text-red-800 mt-1">Score: 0.75 - 1.00</p>
                  <p className="text-xs text-gray-600 mt-2">Seek immediate medical attention</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* History Page */}
        {currentPage === 'history' && (
          <div className="space-y-6 max-w-4xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Assessment History</h2>

            {assessmentHistory.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No assessments yet. Start with a new assessment!</p>
                <Button
                  onClick={() => setCurrentPage('home')}
                  className="bg-clinical-primary hover:bg-clinical-primary/90"
                >
                  New Assessment
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {assessmentHistory.map((entry, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          Assessment {assessmentHistory.length - idx}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {entry.timestamp.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-clinical-primary">
                          {entry.result.riskPercentage}%
                        </p>
                        <p className="text-sm font-semibold text-gray-600">
                          {entry.result.riskCategory} Risk
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 text-xs">Age</p>
                        <p className="font-semibold text-gray-900">{entry.patientData.age}y</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Gender</p>
                        <p className="font-semibold text-gray-900">
                          {entry.patientData.gender === 'M' ? 'Male' : 'Female'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">BP</p>
                        <p className="font-semibold text-gray-900">
                          {entry.patientData.restingBP} mmHg
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Cholesterol</p>
                        <p className="font-semibold text-gray-900">
                          {entry.patientData.chol} mg/dl
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">BMI</p>
                        <p className="font-semibold text-gray-900">
                          {entry.patientData.bmi?.toFixed(1)} kg/m²
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-sm text-gray-600">
            Multi-Stage SAW Cardiovascular Risk Assessment System
            <br />
            Research-based implementation with JAKVAS calibration for Indonesian populations
          </p>
        </div>
      </footer>
    </div>
  );
}

function Activity(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}
