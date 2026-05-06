'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  Sliders,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowRight,
  RefreshCw,
  Info,
  Zap,
  Target,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { GlowCard } from '@/components/animations/GlowCard';
import { FadeIn, StaggeredFadeIn } from '@/components/animations/FadeIn';
import { AnimatedNumber } from '@/components/animations/AnimatedNumber';
import { GradientText } from '@/components/animations/ShimmerText';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';

interface WhatIfScenario {
  id: string;
  label: string;
  currentValue: number | boolean;
  simulatedValue: number | boolean;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  type: 'slider' | 'toggle';
  impact: number;
  category: 'modifiable' | 'non-modifiable';
  icon: React.ReactNode;
  description: string;
}

interface WhatIfDashboardProps {
  currentRisk: number;
  onSimulatedRisk: (risk: number) => void;
  className?: string;
}

const sensitivityData: WhatIfScenario[] = [
  {
    id: 'systolicBP',
    label: 'Systolic Blood Pressure',
    currentValue: 145,
    simulatedValue: 145,
    min: 90,
    max: 200,
    step: 5,
    unit: 'mmHg',
    type: 'slider',
    impact: -4.8,
    category: 'modifiable',
    icon: <TrendingUp className="h-4 w-4" />,
    description: 'Systolic BP reduction of 20 mmHg can reduce CVD risk significantly'
  },
  {
    id: 'diastolicBP',
    label: 'Diastolic Blood Pressure',
    currentValue: 92,
    simulatedValue: 92,
    min: 60,
    max: 140,
    step: 5,
    unit: 'mmHg',
    type: 'slider',
    impact: -2.3,
    category: 'modifiable',
    icon: <TrendingUp className="h-4 w-4" />,
    description: 'Diastolic BP reduction of 12 mmHg has moderate impact on risk'
  },
  {
    id: 'smoking',
    label: 'Smoking Status',
    currentValue: true,
    simulatedValue: false,
    type: 'toggle',
    impact: -10.5,
    category: 'modifiable',
    icon: <Zap className="h-4 w-4" />,
    description: 'Quitting smoking is one of the most impactful lifestyle changes'
  },
  {
    id: 'bmi',
    label: 'BMI',
    currentValue: 27.4,
    simulatedValue: 27.4,
    min: 15,
    max: 45,
    step: 0.5,
    unit: 'kg/m²',
    type: 'slider',
    impact: -8.2,
    category: 'modifiable',
    icon: <Target className="h-4 w-4" />,
    description: 'Weight reduction of 3.4 BMI points can significantly lower risk'
  },
  {
    id: 'physicalActivity',
    label: 'Physical Activity',
    currentValue: 2,
    simulatedValue: 4,
    min: 0,
    max: 7,
    step: 1,
    unit: 'days/week',
    type: 'slider',
    impact: -5.1,
    category: 'modifiable',
    icon: <TrendingDown className="h-4 w-4" />,
    description: 'Increasing activity to 4-5 days per week improves cardiovascular health'
  },
  {
    id: 'stress',
    label: 'Stress Level',
    currentValue: 6,
    simulatedValue: 2,
    min: 0,
    max: 8,
    step: 1,
    unit: 'score',
    type: 'slider',
    impact: -5.5,
    category: 'modifiable',
    icon: <Zap className="h-4 w-4" />,
    description: 'Reducing stress from elevated to normal has meaningful impact'
  }
];

export function WhatIfDashboard({ currentRisk, onSimulatedRisk, className = '' }: WhatIfDashboardProps) {
  const [scenarios, setScenarios] = useState<WhatIfScenario[]>(sensitivityData);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const simulatedRisk = useMemo(() => {
    const totalImpact = scenarios.reduce((sum, s) => {
      if (s.type === 'toggle') {
        const wasActive = s.currentValue === true && s.simulatedValue === false;
        return sum + (wasActive ? s.impact : 0);
      } else {
        const valueDiff = (s.simulatedValue as number) - (s.currentValue as number);
        if (Math.abs(valueDiff) < 0.01) return sum;
        const direction = valueDiff < 0 ? -1 : 1;
        const normalizedDiff = Math.abs(valueDiff) / ((s.max! - s.min!) / 2);
        return sum + (s.impact * normalizedDiff * direction);
      }
    }, 0);
    return Math.max(0, Math.min(100, currentRisk + totalImpact));
  }, [scenarios, currentRisk]);

  React.useEffect(() => {
    onSimulatedRisk(simulatedRisk);
  }, [simulatedRisk, onSimulatedRisk]);

  const handleSliderChange = useCallback((id: string, value: number[]) => {
    setScenarios(prev => prev.map(s => s.id === id ? { ...s, simulatedValue: value[0] } : s));
  }, []);

  const handleToggleChange = useCallback((id: string, checked: boolean) => {
    setScenarios(prev => prev.map(s => s.id === id ? { ...s, simulatedValue: checked } : s));
  }, []);

  const resetAll = useCallback(() => {
    setScenarios(sensitivityData);
  }, []);

  const categoryChange = simulatedRisk - currentRisk;
  const isDecreasing = categoryChange < 0;
  const newCategory = simulatedRisk < 25 ? 'Low' : simulatedRisk < 45 ? 'Moderate' : 'High';

  const sortedScenarios = useMemo(() =>
    [...scenarios].sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact)),
    [scenarios]
  );

  return (
    <section ref={ref} className={className}>
      <FadeIn direction="up" duration={0.6}>
        <GlowCard glowColor="#6366f1" glowIntensity="medium" className="w-full">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <motion.div
                    initial={{ rotate: -10, scale: 0.8 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20"
                  >
                    <Sliders className="h-6 w-6 text-blue-600" />
                  </motion.div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      <GradientText from="#6366f1" to="#8b5cf6">What-If Sensitivity Analysis</GradientText>
                    </h2>
                    <p className="text-sm text-gray-500">Adjust factors to see how your risk changes</p>
                  </div>
                </div>
              </div>
              <button
                onClick={resetAll}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm font-medium text-gray-600"
              >
                <RefreshCw className="h-4 w-4" />
                Reset All
              </button>
            </div>

            {/* Comparison Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative overflow-hidden rounded-2xl p-6 mb-8"
              style={{
                background: isDecreasing
                  ? 'linear-gradient(135deg, #22c55e15 0%, #16a34a10 100%)'
                  : 'linear-gradient(135deg, #ef444415 0%, #dc262610 100%)'
              }}
            >
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
              </div>
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Current Risk</p>
                    <p className="text-3xl font-bold text-gray-700">{currentRisk.toFixed(1)}%</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {currentRisk < 25 ? 'Low' : currentRisk < 45 ? 'Moderate' : 'High'}
                    </p>
                  </div>

                  <motion.div
                    animate={{ x: isDecreasing ? [0, 8, 0] : [0, -8, 0] }}
                    transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                    className="flex flex-col items-center"
                  >
                    <ArrowRight className={`h-6 w-6 ${isDecreasing ? 'text-green-500' : 'text-red-500'}`} />
                    <span className={`text-sm font-bold ${isDecreasing ? 'text-green-600' : 'text-red-600'}`}>
                      {isDecreasing ? '-' : '+'}{Math.abs(categoryChange).toFixed(1)}%
                    </span>
                  </motion.div>

                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Simulated Risk</p>
                    <p className="text-3xl font-bold" style={{
                      color: newCategory === 'Low' ? '#22c55e' : newCategory === 'Moderate' ? '#eab308' : '#ef4444'
                    }}>
                      <AnimatedNumber value={simulatedRisk} decimalPlaces={1} suffix="%" />
                    </p>
                    <p className="text-xs mt-0.5 font-medium" style={{
                      color: newCategory === 'Low' ? '#22c55e' : newCategory === 'Moderate' ? '#eab308' : '#ef4444'
                    }}>
                      {newCategory}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Sensitivity Sliders */}
            <div className="space-y-4 mb-8">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Adjustable Factors
              </h3>
              <StaggeredFadeIn staggerDelay={0.1} className="space-y-4">
                {scenarios.map((scenario, index) => {
                  const isExpanded = expandedId === scenario.id;
                  const change = scenario.type === 'toggle'
                    ? ((!scenario.simulatedValue && scenario.currentValue) ? scenario.impact : 0)
                    : (() => {
                        const normalizedCurrent = ((scenario.currentValue as number) - scenario.min!) / (scenario.max! - scenario.min!);
                        const normalizedSimulated = ((scenario.simulatedValue as number) - scenario.min!) / (scenario.max! - scenario.min!);
                        return scenario.impact * (normalizedSimulated - normalizedCurrent);
                      })();
                  const isPositiveChange = change < 0;

                  return (
                    <motion.div
                      key={scenario.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <GlowCard
                        glowColor={isPositiveChange ? '#22c55e' : '#6366f1'}
                        glowIntensity={isExpanded ? 'medium' : 'low'}
                        className="w-full"
                      >
                        <div className="p-4">
                          {/* Header - clickable div instead of button to avoid nesting issues */}
                          <div
                            onClick={() => setExpandedId(isExpanded ? null : scenario.id)}
                            className="w-full cursor-pointer"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${scenario.category === 'modifiable' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                                  {scenario.icon}
                                </div>
                                <div className="text-left">
                                  <p className="font-semibold text-gray-800">{scenario.label}</p>
                                  <p className="text-xs text-gray-400">
                                    {scenario.type === 'toggle'
                                      ? scenario.currentValue ? 'Currently Smoker' : 'Currently Non-Smoker'
                                      : `Current: ${scenario.currentValue}${scenario.unit}`
                                    }
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                {change !== 0 && (
                                  <span className={`text-sm font-bold ${isPositiveChange ? 'text-green-600' : 'text-gray-400'}`}>
                                    {isPositiveChange ? '' : '+'}{change.toFixed(1)}%
                                  </span>
                                )}
                                {isExpanded ? (
                                  <ChevronUp className="h-5 w-5 text-gray-400" />
                                ) : (
                                  <ChevronDown className="h-5 w-5 text-gray-400" />
                                )}
                              </div>
                            </div>

                            {/* Simple Slider - outside button to avoid nesting */}
                            {!isExpanded && scenario.type !== 'toggle' && (
                              <div className="mb-2">
                                <Slider
                                  value={[scenario.simulatedValue as number]}
                                  min={scenario.min}
                                  max={scenario.max}
                                  step={scenario.step}
                                  onValueChange={(v) => handleSliderChange(scenario.id, v)}
                                  className="w-full"
                                />
                                <div className="flex justify-between text-xs text-gray-400 mt-1">
                                  <span>{scenario.min}{scenario.unit}</span>
                                  <span className="font-medium text-blue-600">{scenario.simulatedValue}{scenario.unit}</span>
                                  <span>{scenario.max}{scenario.unit}</span>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Toggle - outside the clickable header div to avoid nesting */}
                          {!isExpanded && scenario.type === 'toggle' && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-500">
                                {scenario.simulatedValue ? 'Quitting would help' : 'Already quit - great!'}
                              </span>
                              <Switch
                                checked={!scenario.simulatedValue}
                                onCheckedChange={(checked) => handleToggleChange(scenario.id, !checked)}
                              />
                            </div>
                          )}

                          {/* Expanded Details */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="pt-4 border-t border-gray-100">
                                  {scenario.type === 'toggle' ? (
                                    <div className="space-y-3">
                                      <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Simulate quitting smoking</span>
                                        <Switch
                                          checked={!scenario.simulatedValue}
                                          onCheckedChange={(checked) => handleToggleChange(scenario.id, !checked)}
                                        />
                                      </div>
                                      <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                                        <p className="text-sm text-green-700">
                                          <strong>Impact:</strong> {scenario.impact}% risk reduction
                                        </p>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="space-y-4">
                                      <Slider
                                        value={[scenario.simulatedValue as number]}
                                        min={scenario.min}
                                        max={scenario.max}
                                        step={scenario.step}
                                        onValueChange={(v) => handleSliderChange(scenario.id, v)}
                                        className="w-full"
                                      />
                                      <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-400">{scenario.min}{scenario.unit}</span>
                                        <span className="font-bold text-blue-600">{scenario.simulatedValue}{scenario.unit}</span>
                                        <span className="text-gray-400">{scenario.max}{scenario.unit}</span>
                                      </div>
                                      <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                                        <p className="text-sm text-green-700">
                                          <strong>Impact:</strong> {scenario.impact > 0 ? '+' : ''}{scenario.impact}% per unit change
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                  <p className="text-xs text-gray-500 mt-3 italic">{scenario.description}</p>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </GlowCard>
                    </motion.div>
                  );
                })}
              </StaggeredFadeIn>
            </div>

            {/* Top 3 Actionable Insights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="p-5 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100"
            >
              <div className="flex items-center gap-2 mb-4">
                <Zap className="h-5 w-5 text-blue-600" />
                <h3 className="font-bold text-gray-800">Top 3 Actionable Factors</h3>
              </div>
              <div className="space-y-3">
                {sortedScenarios.filter(s => s.category === 'modifiable').slice(0, 3).map((scenario, index) => (
                  <div key={scenario.id} className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{scenario.label}</p>
                    </div>
                    <span className="text-sm font-bold text-green-600">
                      {scenario.impact > 0 ? '+' : ''}{scenario.impact}%
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </GlowCard>
      </FadeIn>
    </section>
  );
}
