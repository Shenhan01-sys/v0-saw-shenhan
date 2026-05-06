'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PatientForm } from '@/components/patient-form';
import { AssessmentResults } from '@/components/assessment-results';
import { PatientData, assessCardiovascularRisk, AssessmentResult } from '@/lib/saw-engine';
import { Button } from '@/components/ui/button';
import { BookOpen, Home, History, Activity, Heart, Shield } from 'lucide-react';
import AuroraBackground from '@/components/animations/AuroraBackground';
import AnimatedBackgroundGradient from '@/components/animations/AnimatedBackgroundGradient';
import { MorphingCard, GlassmorphismCard, AnimatedProgress3D, TypewriterText, Floating3DIcon, RippleButton, TiltCard3D, ExpandableCard, SwipeCarousel } from '@/components/animations/creative-ui';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 relative overflow-hidden">
      <AnimatedBackgroundGradient className="fixed inset-0" />
      <div className="relative z-10">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-clinical-border shadow-sm">
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
          <div className="space-y-8 animate-slide-in-left">
            <div className="text-center mb-8">
              <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                <TypewriterText text="Cardiovascular Risk Assessment" speed={40} />
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Multi-Stage SAW with Entropy-Based Weighting for early detection of cardiovascular disease
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <MorphingCard glowColor="rgba(59, 130, 246, 0.6)" className="h-full">
                <div className="flex items-center gap-4">
                  <Floating3DIcon icon={<Activity className="h-10 w-10 text-blue-600" />} floatRange={10} duration={2} />
                  <div>
                    <div className="text-3xl font-bold text-clinical-primary mb-1">24</div>
                    <p className="font-semibold text-gray-900 mb-1">Clinical Features</p>
                    <p className="text-sm text-gray-600">
                      15 Stage-1 + 9 Stage-2 features
                    </p>
                  </div>
                </div>
              </MorphingCard>

              <MorphingCard glowColor="rgba(168, 85, 247, 0.6)" className="h-full">
                <div className="flex items-center gap-4">
                  <Floating3DIcon icon={<Shield className="h-10 w-10 text-purple-600" />} floatRange={12} duration={2.5} />
                  <div>
                    <div className="text-3xl font-bold text-clinical-primary mb-1">3</div>
                    <p className="font-semibold text-gray-900 mb-1">Risk Categories</p>
                    <p className="text-sm text-gray-600">
                      Low / Moderate / High
                    </p>
                  </div>
                </div>
              </MorphingCard>

              <MorphingCard glowColor="rgba(236, 72, 153, 0.6)" className="h-full">
                <div className="flex items-center gap-4">
                  <Floating3DIcon icon={<Heart className="h-10 w-10 text-pink-600" />} floatRange={8} duration={3} />
                  <div>
                    <div className="text-3xl font-bold text-clinical-primary mb-1">0.80</div>
                    <p className="font-semibold text-gray-900 mb-1">ROC-AUC</p>
                    <p className="text-sm text-gray-600">
                      High accuracy model
                    </p>
                  </div>
                </div>
              </MorphingCard>
            </div>

            <div className="max-w-2xl mx-auto">
              <ExpandableCard title="How It Works - Click to expand" className="mb-6">
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-50/50 to-transparent">
                    <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">1</span>
                    <div>
                      <p className="font-semibold text-gray-900">Data Collection</p>
                      <p className="text-gray-600">Enter patient demographics, lifestyle, medical history, and blood measurements</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-purple-50/50 to-transparent">
                    <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">2</span>
                    <div>
                      <p className="font-semibold text-gray-900">Stage 1 Scoring</p>
                      <p className="text-gray-600">15 BRFSS features → SAW with gradient-descent weights (V1)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-pink-50/50 to-transparent">
                    <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm">3</span>
                    <div>
                      <p className="font-semibold text-gray-900">Stage 2 Scoring</p>
                      <p className="text-gray-600">9 blood/BP features → SAW with entropy weights (V2)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-emerald-50/50 to-transparent">
                    <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm">4</span>
                    <div>
                      <p className="font-semibold text-gray-900">Integration</p>
                      <p className="text-gray-600">V_final = 0.70 × V1 + 0.30 × V2</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-orange-50/50 to-transparent">
                    <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm">5</span>
                    <div>
                      <p className="font-semibold text-gray-900">Categorization</p>
                      <p className="text-gray-600">Low / Moderate / High based on calibrated thresholds</p>
                    </div>
                  </div>
                </div>
              </ExpandableCard>

              <PatientForm
                onSubmit={handleAssessment}
                isLoading={isLoading}
              />
            </div>
          </div>
        )}

        {/* Assessment Results */}
        {currentPage === 'assessment' && assessment && (
          <div className="space-y-6 animate-slide-in-right">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-900">Assessment Results</h2>
              <Button variant="outline" onClick={() => setCurrentPage('home')} className="animate-hover-lift">
                New Assessment
              </Button>
            </div>
            <AssessmentResults result={assessment.result} timestamp={assessment.timestamp} />
          </div>
        )}

        {/* History */}
        {currentPage === 'history' && (
          <div className="space-y-6 max-w-4xl animate-slide-in-up">
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
