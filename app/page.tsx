'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PatientForm } from '@/components/patient-form';
import { AssessmentResults } from '@/components/assessment-results';
import { PatientData, assessCardiovascularRisk, AssessmentResult } from '@/lib/saw-engine';
import { Button } from '@/components/ui/button';
import { BookOpen, Home, History } from 'lucide-react';

const AGE_LABELS: Record<number, string> = {
  1: '18–24', 2: '25–29', 3: '30–34', 4: '35–39', 5: '40–44',
  6: '45–49', 7: '50–54', 8: '55–59', 9: '60–64', 10: '65–69',
  11: '70–74', 12: '75–79', 13: '80+',
};

const GEN_HEALTH_LABELS: Record<number, string> = {
  1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Very Good', 5: 'Excellent',
};

type HistoryEntry = {
  result: AssessmentResult;
  patientData: PatientData;
  timestamp: Date;
};

export default function Page() {
  const [currentPage, setCurrentPage] = useState<'home' | 'assessment' | 'history'>('home');
  const [assessment, setAssessment] = useState<{ result: AssessmentResult; timestamp: Date } | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAssessment = (patientData: PatientData) => {
    setIsLoading(true);
    setTimeout(() => {
      const result = assessCardiovascularRisk(patientData);
      const timestamp = new Date();
      setAssessment({ result, timestamp });
      setHistory((prev) => [
        { result, patientData, timestamp },
        ...prev.slice(0, 9),
      ]);
      setCurrentPage('assessment');
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-clinical-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-to-br from-clinical-primary to-clinical-secondary rounded-lg flex items-center justify-center">
                <ActivityIcon className="h-6 w-6 text-white" />
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
              <Link href="/methodology">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span className="hidden sm:inline">Methodology</span>
                </Button>
              </Link>
              <Button
                variant={currentPage === 'history' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentPage('history')}
                className="flex items-center gap-2"
              >
                <History className="h-4 w-4" />
                <span className="hidden sm:inline">
                  History {history.length > 0 && `(${history.length})`}
                </span>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Home */}
        {currentPage === 'home' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Cardiovascular Risk Assessment
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Multi-Stage SAW (Simple Additive Weighting) with Entropy-Based Weighting for
                early detection of cardiovascular disease in Indonesian primary health care
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="text-3xl font-bold text-clinical-primary mb-2">24</div>
                <p className="font-semibold text-gray-900 mb-1">Clinical Features</p>
                <p className="text-sm text-gray-600">
                  15 Stage-1 (Heart dataset) + 9 Stage-2 (Cardio dataset)
                </p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="text-3xl font-bold text-clinical-primary mb-2">3</div>
                <p className="font-semibold text-gray-900 mb-1">Risk Categories</p>
                <p className="text-sm text-gray-600">
                  Low (&lt;25%), Moderate (25–45%), High (≥45%)
                </p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="text-3xl font-bold text-clinical-primary mb-2">0.80</div>
                <p className="font-semibold text-gray-900 mb-1">ROC-AUC</p>
                <p className="text-sm text-gray-600">
                  Stage 1 trained on 319,795 patients (BRFSS 2020)
                </p>
              </div>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-blue-900 mb-3">How It Works</h3>
                <ol className="space-y-2 text-sm text-blue-800">
                  <li><strong>1. Data Collection:</strong> Enter patient demographics, lifestyle, medical history, and blood measurements</li>
                  <li><strong>2. Stage 1 Scoring:</strong> 15 BRFSS features → SAW with gradient-descent weights (V1)</li>
                  <li><strong>3. Stage 2 Scoring:</strong> 9 blood/BP features → SAW with entropy weights (V2)</li>
                  <li><strong>4. Integration:</strong> V_final = 0.70 × V1 + 0.30 × V2</li>
                  <li><strong>5. Categorization:</strong> Low / Moderate / High based on calibrated thresholds</li>
                </ol>
              </div>

              <PatientForm
                onSubmit={handleAssessment}
                isLoading={isLoading}
              />
            </div>
          </div>
        )}

        {/* Assessment Results */}
        {currentPage === 'assessment' && assessment && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-900">Assessment Results</h2>
              <Button variant="outline" onClick={() => setCurrentPage('home')}>
                New Assessment
              </Button>
            </div>
            <AssessmentResults result={assessment.result} timestamp={assessment.timestamp} />
          </div>
        )}

        {/* History */}
        {currentPage === 'history' && (
          <div className="space-y-6 max-w-4xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Assessment History</h2>

            {history.length === 0 ? (
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
                {history.map((entry, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          Assessment {history.length - idx}
                        </h3>
                        <p className="text-sm text-gray-500">{entry.timestamp.toLocaleString()}</p>
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
                        <p className="text-gray-500 text-xs">Age Group</p>
                        <p className="font-semibold text-gray-900">
                          {AGE_LABELS[entry.patientData.ageCategory] ?? `Cat ${entry.patientData.ageCategory}`}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">BMI</p>
                        <p className="font-semibold text-gray-900">
                          {entry.patientData.bmi.toFixed(1)} kg/m²
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Smoking</p>
                        <p className="font-semibold text-gray-900">
                          {entry.patientData.smoking ? 'Yes' : 'No'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Diabetic</p>
                        <p className="font-semibold text-gray-900">
                          {entry.patientData.diabetic ? 'Yes' : 'No'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Gen. Health</p>
                        <p className="font-semibold text-gray-900">
                          {GEN_HEALTH_LABELS[entry.patientData.genHealth] ?? entry.patientData.genHealth}
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
            Research-based implementation for Indonesian primary health care (FKTP)
          </p>
        </div>
      </footer>
    </div>
  );
}

function ActivityIcon(props: React.SVGProps<SVGSVGElement>) {
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
