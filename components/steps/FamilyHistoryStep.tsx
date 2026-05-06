'use client';

import React, { useState } from 'react';
import { Heart, Users, ChevronRight, Info, AlertTriangle } from 'lucide-react';

interface FamilyHistoryStepProps {
  value: 'yes' | 'no' | 'unknown' | null;
  onChange: (value: 'yes' | 'no' | 'unknown') => void;
  onNext: () => void;
  onBack: () => void;
}

export function FamilyHistoryStep({ value, onChange, onNext, onBack }: FamilyHistoryStepProps) {
  const [showInfo, setShowInfo] = useState(false);

  const options = [
    {
      id: 'yes' as const,
      label: 'Yes',
      description: 'At least one immediate family member had CVD before age 55 (men) or 65 (women)',
      icon: <AlertTriangle className="h-6 w-6" />,
      color: '#ef4444',
      bg: 'bg-red-50',
      border: 'border-red-200',
      selectedBg: 'bg-red-100',
      selectedBorder: 'border-red-400'
    },
    {
      id: 'no' as const,
      label: 'No',
      description: 'No family history of premature cardiovascular disease',
      icon: <Heart className="h-6 w-6" />,
      color: '#22c55e',
      bg: 'bg-green-50',
      border: 'border-green-200',
      selectedBg: 'bg-green-100',
      selectedBorder: 'border-green-400'
    },
    {
      id: 'unknown' as const,
      label: "I don't know",
      description: 'Uncertain about family medical history',
      icon: <Users className="h-6 w-6" />,
      color: '#6b7280',
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      selectedBg: 'bg-gray-100',
      selectedBorder: 'border-gray-400'
    }
  ];

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-pink-500/20 to-red-500/20 mb-4">
          <Users className="h-8 w-8 text-pink-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
          Family Health History
        </h2>
        <p className="text-gray-500 text-sm">
          Does any immediate family member (parent or sibling) have a history of cardiovascular disease
          before age 55 (men) or 65 (women)?
        </p>
      </div>

      {/* Info Box */}
      <div className="mb-6">
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="w-full flex items-center justify-between p-4 rounded-xl bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Info className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Why is this important?</span>
          </div>
          <ChevronRight className={`h-4 w-4 text-blue-500 transition-transform ${showInfo && 'rotate-90'}`} />
        </button>
        {showInfo && (
          <div className="p-4 bg-blue-50/50 border border-t-0 border-blue-200 rounded-b-xl text-sm text-blue-800">
            <p className="mb-2">
              <strong>Family history of premature CVD is a risk-enhancing factor.</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 text-blue-700">
              <li>ESC 2021 guidelines recommend family history for pre-test probability calibration</li>
              <li>HR = 2.0 for CVD events in first-degree relatives with premature disease</li>
              <li>ACC/AHA 2019 classifies it as a risk-enhancing factor requiring evaluation</li>
            </ul>
          </div>
        )}
      </div>

      {/* Options */}
      <div className="space-y-3 mb-8">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => onChange(option.id)}
            className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${
              value === option.id
                ? `${option.selectedBg} ${option.selectedBorder} shadow-lg`
                : `${option.bg} ${option.border} hover:shadow-md`
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className="p-3 rounded-xl"
                style={{
                  backgroundColor: value === option.id ? option.color : 'transparent',
                  color: value === option.id ? 'white' : option.color
                }}
              >
                {option.icon}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{option.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{option.description}</p>
              </div>
              {value === option.id && (
                <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center bg-white" style={{ borderColor: option.color }}>
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: option.color }} />
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Clinical Impact Preview */}
      {value && (
        <div
          className={`p-4 rounded-xl mb-6 ${
            value === 'yes'
              ? 'bg-red-50 border border-red-200'
              : value === 'unknown'
              ? 'bg-yellow-50 border border-yellow-200'
              : 'bg-green-50 border border-green-200'
          }`}
        >
          <p className={`text-sm font-medium ${
            value === 'yes'
              ? 'text-red-700'
              : value === 'unknown'
              ? 'text-yellow-700'
              : 'text-green-700'
          }`}>
            {value === 'yes' && (
              <>
                <strong>Clinical Impact:</strong> Family history positive elevates your risk multiplier.
                Your final risk score will be adjusted accordingly.
              </>
            )}
            {value === 'no' && (
              <>
                <strong>No Adjustment:</strong> No family history adjustment will be applied.
                Your risk calculation will proceed with standard parameters.
              </>
            )}
            {value === 'unknown' && (
              <>
                <strong>Note:</strong> Family history adjustment cannot be applied.
                Consider discussing family medical history with your healthcare provider.
              </>
            )}
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-3 px-6 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 hover:border-gray-300 transition-all"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!value}
          className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all ${
            value
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
