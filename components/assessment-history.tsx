'use client';

import { useState, useEffect } from 'react';
import { Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import type { AssessmentRecord } from '@/lib/types';

interface AssessmentHistoryProps {
  assessments: AssessmentRecord[];
  onDelete: (id: string) => void;
  onSelect: (assessment: AssessmentRecord) => void;
}

export function AssessmentHistory({
  assessments,
  onDelete,
  onSelect,
}: AssessmentHistoryProps) {
  const [sortBy, setSortBy] = useState<'date' | 'risk'>('date');

  const sortedAssessments = [...assessments].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else {
      return b.riskScore - a.riskScore;
    }
  });

  const getRiskColor = (score: number) => {
    if (score < 0.35) return 'bg-green-100 text-green-900 border-green-300';
    if (score < 0.65) return 'bg-yellow-100 text-yellow-900 border-yellow-300';
    if (score < 0.85) return 'bg-orange-100 text-orange-900 border-orange-300';
    return 'bg-red-100 text-red-900 border-red-300';
  };

  const getRiskLabel = (score: number) => {
    if (score < 0.35) return 'LOW';
    if (score < 0.65) return 'MODERATE';
    if (score < 0.85) return 'HIGH';
    return 'VERY HIGH';
  };

  const calculateRiskTrend = (current: number, previous?: number) => {
    if (!previous) return null;
    return current > previous ? 'increased' : current < previous ? 'decreased' : 'stable';
  };

  if (assessments.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-600 mb-2">No assessments yet</p>
        <p className="text-sm text-gray-500">
          Complete an assessment above to start tracking your cardiovascular health
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Assessment History</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setSortBy('date')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              sortBy === 'date'
                ? 'bg-clinical-primary text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            By Date
          </button>
          <button
            onClick={() => setSortBy('risk')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              sortBy === 'risk'
                ? 'bg-clinical-primary text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            By Risk
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {sortedAssessments.map((assessment, idx) => {
          const previous = sortedAssessments[idx + 1];
          const trend = calculateRiskTrend(assessment.riskScore, previous?.riskScore);

          return (
            <div
              key={assessment.id}
              onClick={() => onSelect(assessment)}
              className="p-4 bg-white border border-clinical-border rounded-lg hover:shadow-md hover:border-clinical-primary cursor-pointer transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">
                    {new Date(assessment.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded border ${getRiskColor(assessment.riskScore)}`}>
                  <p className="text-xs font-bold">{getRiskLabel(assessment.riskScore)}</p>
                  <p className="text-xs font-mono">
                    {(assessment.riskScore * 100).toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs text-gray-600 mb-1">Patient: {assessment.patientName}</p>
                  <div className="flex gap-2">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      Age: {assessment.age}
                    </span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      Sex: {assessment.sex === '1' ? 'M' : 'F'}
                    </span>
                  </div>
                </div>

                {trend && (
                  <div className="flex items-center gap-1">
                    {trend === 'increased' && (
                      <TrendingUp className="w-4 h-4 text-red-600" />
                    )}
                    {trend === 'decreased' && (
                      <TrendingDown className="w-4 h-4 text-green-600" />
                    )}
                    {trend === 'stable' && (
                      <div className="w-4 h-4 text-gray-400">→</div>
                    )}
                    <span className="text-xs text-gray-600">
                      {trend === 'increased'
                        ? 'Increased'
                        : trend === 'decreased'
                          ? 'Decreased'
                          : 'Stable'}
                    </span>
                  </div>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(assessment.id);
                  }}
                  className="ml-4 p-2 hover:bg-red-100 rounded text-red-600 transition-colors"
                  title="Delete assessment"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
