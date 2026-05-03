'use client';

import React, { useEffect, useRef } from 'react';
import { AssessmentResult, getRiskColor, getRiskBgColor } from '@/lib/saw-engine';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, TrendingUp, Activity, Layers } from 'lucide-react';
import { CalculationWalkthrough } from '@/components/calculation-walkthrough';
import CountUp from '@/components/animations/CountUp';
import ParticlesEffect from '@/components/animations/ParticlesEffect';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';

interface AssessmentResultsProps {
  result: AssessmentResult;
  timestamp?: Date;
}

const NORM_BADGE: Record<string, string> = {
  Binary:    'bg-gray-100 text-gray-700',
  MinMax:    'bg-blue-100 text-blue-700',
  SweetSpot: 'bg-purple-100 text-purple-700',
  Ordinal:   'bg-amber-100 text-amber-700',
};

function FeatureTable({
  features,
  title,
  description,
}: {
  features: AssessmentResult['stage1Features'];
  title: string;
  description: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-2 px-3 font-semibold text-gray-700">Feature</th>
                <th className="text-left py-2 px-3 font-semibold text-gray-700">Raw</th>
                <th className="text-right py-2 px-3 font-semibold text-gray-700">Norm.</th>
                <th className="text-right py-2 px-3 font-semibold text-gray-700">Weight</th>
                <th className="text-right py-2 px-3 font-semibold text-gray-700">Contrib.</th>
                <th className="text-left py-2 px-3 font-semibold text-gray-700">Type</th>
              </tr>
            </thead>
            <tbody>
              {features.map((f) => (
                <tr key={f.feature} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2 px-3 font-medium text-gray-800">{f.displayName}</td>
                  <td className="py-2 px-3 text-xs font-mono text-gray-600">
                    {typeof f.rawValue === 'number' ? f.rawValue.toFixed(2) : f.rawValue}
                  </td>
                  <td className="text-right py-2 px-3 font-mono font-semibold text-blue-600">
                    {f.normalizedValue.toFixed(4)}
                  </td>
                  <td className="text-right py-2 px-3 font-mono text-purple-600">
                    {(f.weight * 100).toFixed(2)}%
                  </td>
                  <td className="text-right py-2 px-3 font-mono font-semibold text-emerald-600">
                    {f.contribution.toFixed(4)}
                  </td>
                  <td className="py-2 px-3">
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded ${NORM_BADGE[f.normType] ?? 'bg-gray-100'}`}
                    >
                      {f.normType}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export function AssessmentResults({ result, timestamp }: AssessmentResultsProps) {
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const addToRefs = (el: HTMLElement | null, index: number) => {
    sectionRefs.current[index] = el;
  };

  const bgBorder = getRiskBgColor(result.riskCategory);
  const textColor = getRiskColor(result.riskCategory);

  const gaugeColor =
    result.riskPercentage < 25
      ? 'bg-green-500'
      : result.riskPercentage < 45
        ? 'bg-yellow-500'
        : 'bg-red-500';

  return (
    <div className="w-full space-y-6">
      {/* ── Main Risk Card ───────────────────────────────────────────────────── */}
      <Card ref={(el) => addToRefs(el, 0)} className={`border-2 ${bgBorder} relative overflow-hidden scroll-animate`}>
        <div className="absolute inset-0 pointer-events-none">
          <ParticlesEffect
            particleCount={80}
            particleSpread={8}
            speed={0.08}
            particleColors={['#3b82f6', '#6366f1', '#8b5cf6', '#06b6d4']}
            particleBaseSize={60}
            sizeRandomness={0.5}
            disableRotation={true}
            className="opacity-40"
          />
        </div>
        <CardHeader className="pb-4 relative z-10">
          <CardTitle className={`text-4xl font-bold ${textColor}`}>
            {result.riskCategory} Risk
          </CardTitle>
          <CardDescription className="text-lg mt-2">
            Cardiovascular Risk Score: <CountUp to={result.riskPercentage} duration={1.5} decimals={0} suffix="%" className="font-bold text-clinical-primary" />
          </CardDescription>
          {timestamp && (
            <p className="text-xs text-gray-500 mt-1">
              Assessed: {timestamp.toLocaleString()}
            </p>
          )}
        </CardHeader>
        <CardContent>
          {/* Gauge */}
          <div className="mb-6">
            <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-700 ${gaugeColor}`}
                style={{ width: `${Math.max(2, result.riskPercentage)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Low (&lt;25%)</span>
              <span>Moderate (25–45%)</span>
              <span>High (≥45%)</span>
            </div>
          </div>

          {/* Interpretation */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                {result.riskCategory === 'Low' && (
                  <p>
                    Cardiovascular risk is <strong>low</strong>. Continue healthy lifestyle habits —
                    regular exercise, balanced diet, and adequate sleep.
                  </p>
                )}
                {result.riskCategory === 'Moderate' && (
                  <p>
                    Cardiovascular risk is <strong>moderate</strong>. Schedule a consultation with
                    your healthcare provider and consider preventive measures.
                  </p>
                )}
                {result.riskCategory === 'High' && (
                  <p>
                    Cardiovascular risk is <strong>high</strong>. Prompt evaluation by a cardiologist
                    is recommended for further workup and treatment planning.
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Score Breakdown ──────────────────────────────────────────────────── */}
      <Card ref={(el) => addToRefs(el, 1)} className="scroll-animate-right">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-clinical-primary" />
            Two-Stage Score Breakdown
          </CardTitle>
          <CardDescription>
            V_final = 0.70 × V1 (Heart dataset) + 0.30 × V2 (Cardio dataset)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: 'V1\n(Stage 1)', value: result.v1Score * 100, color: '#3b82f6', weight: 'λ₁ = 0.70' },
                  { name: 'V2\n(Stage 2)', value: result.v2Score * 100, color: '#8b5cf6', weight: 'λ₂ = 0.30' },
                  { name: 'V_final', value: result.vFinal * 100, color: result.riskPercentage < 25 ? '#22c55e' : result.riskPercentage < 45 ? '#eab308' : '#ef4444', weight: 'Final' },
                ]}
                margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
              >
                <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} unit="%" />
                <Tooltip
                  formatter={(value: number) => [`${value.toFixed(1)}%`, 'Score']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={80}>
                  {[
                    { name: 'V1\n(Stage 1)', value: result.v1Score * 100, color: '#3b82f6', weight: 'λ₁ = 0.70' },
                    { name: 'V2\n(Stage 2)', value: result.v2Score * 100, color: '#8b5cf6', weight: 'λ₂ = 0.30' },
                    { name: 'V_final', value: result.vFinal * 100, color: result.riskPercentage < 25 ? '#22c55e' : result.riskPercentage < 45 ? '#eab308' : '#ef4444', weight: 'Final' },
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                  <LabelList dataKey="value" position="top" formatter={(v: number) => `${v.toFixed(1)}%`} style={{ fontSize: 13, fontWeight: 600 }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
              <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">
                Stage 1 — V1
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {(result.v1Score * 100).toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500 mt-1">λ₁ = 0.70</p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center">
              <p className="text-xs font-semibold text-purple-700 uppercase tracking-wide mb-1">
                Stage 2 — V2
              </p>
              <p className="text-2xl font-bold text-purple-600">
                {(result.v2Score * 100).toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500 mt-1">λ₂ = 0.30</p>
            </div>

            <div className={`border-2 rounded-lg p-3 text-center ${bgBorder}`}>
              <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${textColor}`}>
                Final — V_final
              </p>
              <p className={`text-2xl font-bold ${textColor}`}>
                {(result.vFinal * 100).toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500 mt-1">{result.riskCategory}</p>
            </div>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg text-xs text-gray-600 font-mono text-center">
            V_final = 0.70 × {(result.v1Score * 100).toFixed(2)}% + 0.30 ×{' '}
            {(result.v2Score * 100).toFixed(2)}% ={' '}
            <strong>{(result.vFinal * 100).toFixed(2)}%</strong>
          </div>
        </CardContent>
      </Card>

      {/* ── Top Contributors ─────────────────────────────────────────────────── */}
      <Card ref={(el) => addToRefs(el, 2)} className="scroll-animate-left">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-clinical-primary" />
            Top Risk Contributions — Stage 1
          </CardTitle>
          <CardDescription>
            Features ranked by weighted contribution to V1 score (pre-trained weights, ROC-AUC 0.8044)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {result.stage1Features.slice(0, 6).map((f) => {
              const pct = result.v1Score > 0 ? (f.contribution / result.v1Score) * 100 : 0;
              return (
                <div key={f.feature}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">{f.displayName}</span>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="font-mono">{f.contribution.toFixed(4)}</span>
                      <span className="text-gray-400">({pct.toFixed(1)}%)</span>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-clinical-primary rounded-full"
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* ── Stage 1 Feature Table ────────────────────────────────────────────── */}
      <div ref={(el) => addToRefs(el, 3)} className="scroll-animate-scale">
        <FeatureTable
          features={result.stage1Features}
          title="Stage 1 — Heart Dataset Features (15)"
          description="BRFSS 2020 population data — gradient descent trained weights (319,795 patients)"
        />
      </div>

      {/* ── Stage 2 Feature Table ────────────────────────────────────────────── */}
      <div ref={(el) => addToRefs(el, 4)} className="scroll-animate">
        <FeatureTable
          features={result.stage2Features}
          title="Stage 2 — Cardio Dataset Features (9)"
          description="Blood pressure and biochemical markers — entropy-based weights (70,000 patients)"
        />
      </div>

      {/* ── Calculation Walkthrough ──────────────────────────────────────────── */}
      <div ref={(el) => addToRefs(el, 5)} className="scroll-animate-right">
        <CalculationWalkthrough result={result} />
      </div>

      {/* ── Methodology Note ─────────────────────────────────────────────────── */}
      <Card ref={(el) => addToRefs(el, 6)} className="scroll-animate">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-clinical-primary" />
            Methodology
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg space-y-2">
            <p>
              <strong>Stage 1 (V1):</strong> SAW using pre-trained weights from gradient descent
              optimization on 319,795-patient Heart dataset (BRFSS 2020). ROC-AUC = 0.8044,
              class imbalance handled with pos_weight = 10.68.
            </p>
            <p>
              <strong>Stage 2 (V2):</strong> SAW using entropy-based weights derived from
              70,000-patient Cardio dataset. Blood pressure and biochemical markers are normalized
              using sweet-spot ranges reflecting optimal clinical values.
            </p>
            <p>
              <strong>Integration:</strong> V_final = 0.70 × V1 + 0.30 × V2. Lambda weights
              reflect dataset size and model reliability (Stage 1 larger and clinically validated).
            </p>
            <p>
              <strong>Sweet Spot Normalization:</strong> Features like BMI [18.5–24.9],
              SleepTime [7–8h], SystolicBP [90–120], DiastolicBP [60–80] score 1.0 within
              the optimal range and decrease linearly outside it.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
