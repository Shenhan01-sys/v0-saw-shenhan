'use client';

import React from 'react';
import { AssessmentResult, getRiskColor, getRiskBgColor } from '@/lib/saw-engine';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, TrendingUp, Activity, Layers } from 'lucide-react';
import { CalculationWalkthrough } from '@/components/calculation-walkthrough';

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
      <Card className={`border-2 ${bgBorder}`}>
        <CardHeader className="pb-4">
          <CardTitle className={`text-4xl font-bold ${textColor}`}>
            {result.riskCategory} Risk
          </CardTitle>
          <CardDescription className="text-lg mt-2">
            Cardiovascular Risk Score: {result.riskPercentage}%
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-clinical-primary" />
            Two-Stage Score Breakdown
          </CardTitle>
          <CardDescription>
            V_final = 0.70 × V1 (Heart dataset) + 0.30 × V2 (Cardio dataset)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">
                Stage 1 — V1
              </p>
              <p className="text-3xl font-bold text-blue-600">
                {(result.v1Score * 100).toFixed(1)}%
              </p>
              <p className="text-xs text-gray-600 mt-1">Heart dataset (15 features)</p>
              <p className="text-xs text-gray-500">λ₁ = 0.70</p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
              <p className="text-xs font-semibold text-purple-700 uppercase tracking-wide mb-1">
                Stage 2 — V2
              </p>
              <p className="text-3xl font-bold text-purple-600">
                {(result.v2Score * 100).toFixed(1)}%
              </p>
              <p className="text-xs text-gray-600 mt-1">Cardio dataset (9 features)</p>
              <p className="text-xs text-gray-500">λ₂ = 0.30</p>
            </div>

            <div className={`border-2 rounded-lg p-4 text-center ${bgBorder}`}>
              <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${textColor}`}>
                Final Score — V_final
              </p>
              <p className={`text-3xl font-bold ${textColor}`}>
                {(result.vFinal * 100).toFixed(1)}%
              </p>
              <p className="text-xs text-gray-600 mt-1">{result.riskCategory} Risk</p>
              <p className="text-xs text-gray-500">
                Threshold: Low &lt;25% | Moderate &lt;45% | High ≥45%
              </p>
            </div>
          </div>

          <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-600 font-mono text-center">
            V_final = 0.70 × {(result.v1Score * 100).toFixed(2)}% + 0.30 ×{' '}
            {(result.v2Score * 100).toFixed(2)}% ={' '}
            <strong>{(result.vFinal * 100).toFixed(2)}%</strong>
          </div>
        </CardContent>
      </Card>

      {/* ── Top Contributors ─────────────────────────────────────────────────── */}
      <Card>
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
      <FeatureTable
        features={result.stage1Features}
        title="Stage 1 — Heart Dataset Features (15)"
        description="BRFSS 2020 population data — gradient descent trained weights (319,795 patients)"
      />

      {/* ── Stage 2 Feature Table ────────────────────────────────────────────── */}
      <FeatureTable
        features={result.stage2Features}
        title="Stage 2 — Cardio Dataset Features (9)"
        description="Blood pressure and biochemical markers — entropy-based weights (70,000 patients)"
      />

      {/* ── Calculation Walkthrough ──────────────────────────────────────────── */}
      <CalculationWalkthrough result={result} />

      {/* ── Methodology Note ─────────────────────────────────────────────────── */}
      <Card>
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
