'use client';

import React from 'react';
import { AssessmentResult, getRiskCategoryColor, getRiskCategoryBgColor } from '@/lib/saw-engine';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, TrendingUp, Gauge, Activity } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface AssessmentResultsProps {
  result: AssessmentResult;
  timestamp?: Date;
}

export function AssessmentResults({ result, timestamp }: AssessmentResultsProps) {
  // Prepare data for feature contribution chart
  const featureData = result.featureScores.map((score) => ({
    name: score.name,
    value: Math.round(score.contribution * 1000) / 10, // Convert to percentage
  }));

  // Colors for visualization
  const riskColors = {
    Low: '#22c55e',
    Moderate: '#f59e0b',
    High: '#ff6b6b',
    'Very High': '#dc2626',
  };

  const normalizedColors = {
    Benefit: '#06b6d4',
    Cost: '#ef4444',
    SweetSpot: '#8b5cf6',
  };

  return (
    <div className="w-full space-y-6">
      {/* Main Risk Assessment Card */}
      <Card
        className={`border-2 ${getRiskCategoryBgColor(result.riskCategory).split(' ')[1]}`}
      >
        <CardHeader className="pb-4">
          <CardTitle className={`text-4xl font-bold ${getRiskCategoryColor(result.riskCategory)}`}>
            {result.riskCategory} Risk
          </CardTitle>
          <CardDescription className="text-lg mt-2">
            Cardiovascular Risk Score: {result.riskPercentage}%
          </CardDescription>
          {timestamp && (
            <p className="text-xs text-gray-500 mt-2">
              Assessment performed: {timestamp.toLocaleString()}
            </p>
          )}
        </CardHeader>
        <CardContent>
          {/* Risk Gauge Visualization */}
          <div className="mb-6">
            <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  result.riskPercentage < 25
                    ? 'bg-green-500'
                    : result.riskPercentage < 50
                      ? 'bg-yellow-500'
                      : result.riskPercentage < 75
                        ? 'bg-orange-500'
                        : 'bg-red-500'
                }`}
                style={{ width: `${result.riskPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-600 mt-2">
              <span>0% (Low)</span>
              <span>100% (Very High)</span>
            </div>
          </div>

          {/* Risk Interpretation */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                {result.riskCategory === 'Low' && (
                  <p>
                    Your cardiovascular risk is <strong>low</strong>. Continue with healthy lifestyle
                    habits including regular exercise, balanced diet, and stress management.
                  </p>
                )}
                {result.riskCategory === 'Moderate' && (
                  <p>
                    Your cardiovascular risk is <strong>moderate</strong>. Consider scheduling a
                    consultation with your healthcare provider and implementing preventive measures.
                  </p>
                )}
                {result.riskCategory === 'High' && (
                  <p>
                    Your cardiovascular risk is <strong>high</strong>. It is recommended to schedule an
                    appointment with a cardiologist for further evaluation and treatment planning.
                  </p>
                )}
                {result.riskCategory === 'Very High' && (
                  <p>
                    Your cardiovascular risk is <strong>very high</strong>. Please seek immediate medical
                    attention and consult with a cardiologist. This assessment requires professional
                    clinical evaluation.
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assessment Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Feature Contribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-clinical-primary" />
              Feature Contributions
            </CardTitle>
            <CardDescription>Relative impact of each clinical parameter</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={featureData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {featureData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        [
                          '#8b5cf6',
                          '#06b6d4',
                          '#f59e0b',
                          '#10b981',
                          '#ef4444',
                          '#3b82f6',
                          '#ec4899',
                          '#6366f1',
                          '#f97316',
                          '#14b8a6',
                          '#6b7280',
                          '#d946ef',
                        ][index % 12]
                      }
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Risk Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="h-5 w-5 text-clinical-primary" />
              Key Metrics
            </CardTitle>
            <CardDescription>Normalized parameter values</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {result.normalizedValues.slice(0, 8).map((value, idx) => (
                <div key={idx} className="pb-3 border-b last:border-b-0">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-medium text-gray-700">{value.name}</span>
                    <span className="text-sm font-semibold text-clinical-primary">
                      {value.normalizedValue.toFixed(3)}
                    </span>
                  </div>
                  <div className="flex gap-2 items-center text-xs text-gray-600">
                    <span className="text-xs font-mono bg-gray-100 px-2 py-0.5 rounded">
                      Raw: {
                        typeof value.rawValue === 'number'
                          ? value.rawValue.toFixed(2)
                          : value.rawValue
                      }
                    </span>
                    <span className="text-gray-500">→</span>
                    <span className="text-xs italic text-gray-600">{value.method}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Entropy Weights Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-clinical-primary" />
            Entropy-Based Weight Analysis
          </CardTitle>
          <CardDescription>
            Information entropy calculation for feature importance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
              This assessment uses <strong>Information Entropy</strong> to calculate the relative importance of each
              clinical parameter. The entropy weight method ensures that features with greater discriminatory power
              receive higher weights in the final risk score calculation.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Entropy Values */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-blue-900 mb-3">Information Entropy</h4>
                <div className="space-y-2 text-xs">
                  {Object.entries(result.entropyWeights.entropies)
                    .slice(0, 5)
                    .map(([feature, value]) => (
                      <div key={feature} className="flex justify-between">
                        <span className="text-gray-700">{feature}:</span>
                        <span className="font-mono font-semibold text-blue-700">
                          {(value as number).toFixed(4)}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Divergence Values */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-purple-900 mb-3">Divergence (d_j)</h4>
                <div className="space-y-2 text-xs">
                  {Object.entries(result.entropyWeights.divergences)
                    .slice(0, 5)
                    .map(([feature, value]) => (
                      <div key={feature} className="flex justify-between">
                        <span className="text-gray-700">{feature}:</span>
                        <span className="font-mono font-semibold text-purple-700">
                          {(value as number).toFixed(4)}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Final Weights */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-emerald-900 mb-3">Final Weights (w_j)</h4>
                <div className="space-y-2 text-xs">
                  {Object.entries(result.entropyWeights.weights)
                    .slice(0, 5)
                    .map(([feature, value]) => (
                      <div key={feature} className="flex justify-between">
                        <span className="text-gray-700">{feature}:</span>
                        <span className="font-mono font-semibold text-emerald-700">
                          {((value as number) * 100).toFixed(1)}%
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-900">
              <strong>Calculation Process:</strong>
              <ol className="list-decimal list-inside mt-2 space-y-1 text-xs">
                <li>Information Entropy (E_j) = -k × Σ(P_ij × ln(P_ij)) where k = 1/ln(m)</li>
                <li>Divergence (d_j) = 1 - E_j</li>
                <li>Final Weight (w_j) = d_j / Σ(d_j)</li>
                <li>SAW Score (V) = Σ(w_j × r_ij)</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calibration & Adjustments */}
      <Card>
        <CardHeader>
          <CardTitle>Calibration & Population Adjustments</CardTitle>
          <CardDescription>
            JAKVAS calibration for Indonesian population specificity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-blue-900 mb-2">JAKVAS Calibration</p>
              <p className="text-2xl font-bold text-blue-600">
                {result.calibrationFactors.jakvasCalibration.toFixed(3)}x
              </p>
              <p className="text-xs text-gray-600 mt-2">
                Adjustment for Indonesian population epidemiology
              </p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-purple-900 mb-2">Imbalance Correction</p>
              <p className="text-2xl font-bold text-purple-600">
                {result.calibrationFactors.imbalanceCorrection.toFixed(3)}x
              </p>
              <p className="text-xs text-gray-600 mt-2">
                Adjustment for training data class imbalance
              </p>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-emerald-900 mb-2">Population Adjustment</p>
              <p className="text-2xl font-bold text-emerald-600">
                {result.calibrationFactors.populationAdjustment.toFixed(3)}x
              </p>
              <p className="text-xs text-gray-600 mt-2">
                Additional demographic adjustments
              </p>
            </div>
          </div>

          <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm text-gray-700">
            <strong>About These Adjustments:</strong>
            <ul className="list-disc list-inside mt-2 space-y-1 text-xs">
              <li>
                <strong>JAKVAS Calibration:</strong> Jakarta Vascular Score adjustments specific to
                Indonesian cardiovascular epidemiology and demographic risk factors
              </li>
              <li>
                <strong>Imbalance Correction:</strong> Accounts for underrepresentation of cardiovascular
                disease cases in typical population health datasets
              </li>
              <li>
                <strong>Population Adjustment:</strong> Ensures model applicability across different
                Indonesian population subgroups
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Feature Details Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Feature Analysis</CardTitle>
          <CardDescription>Raw values, normalization, and contribution to final score</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-3 font-semibold text-gray-700">Feature</th>
                  <th className="text-right py-3 px-3 font-semibold text-gray-700">Raw Value</th>
                  <th className="text-right py-3 px-3 font-semibold text-gray-700">Normalized</th>
                  <th className="text-right py-3 px-3 font-semibold text-gray-700">Weight</th>
                  <th className="text-right py-3 px-3 font-semibold text-gray-700">Contribution</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-700">Type</th>
                </tr>
              </thead>
              <tbody>
                {result.featureScores.map((score, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-3 font-medium text-gray-800">{score.name}</td>
                    <td className="text-right py-3 px-3 font-mono text-gray-700">
                      {typeof score.rawValue === 'number' ? score.rawValue.toFixed(2) : score.rawValue}
                    </td>
                    <td className="text-right py-3 px-3 font-mono font-semibold text-blue-600">
                      {score.normalizedValue.toFixed(4)}
                    </td>
                    <td className="text-right py-3 px-3 font-mono text-purple-600">
                      {(score.weight * 100).toFixed(2)}%
                    </td>
                    <td className="text-right py-3 px-3 font-mono font-semibold text-emerald-600">
                      {score.contribution.toFixed(4)}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded ${
                          score.type === 'Benefit'
                            ? 'bg-blue-100 text-blue-800'
                            : score.type === 'Cost'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {score.type}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
