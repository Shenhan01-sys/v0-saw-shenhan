'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  Scale,
  TrendingUp,
  ArrowRight,
  Check,
  AlertCircle,
  Info,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { GlowCard } from '@/components/animations/GlowCard';
import { FadeIn, StaggeredFadeIn } from '@/components/animations/FadeIn';
import { AnimatedNumber } from '@/components/animations/AnimatedNumber';
import { GradientText } from '@/components/animations/ShimmerText';
import { AnimatedBorder } from '@/components/animations/BorderEffects';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface WeightComparison {
  feature: string;
  entropyWeight: number;
  criticWeight: number;
  change: number;
  correlation?: number;
}

const weightComparisons: WeightComparison[] = [
  { feature: 'SystolicBP', entropyWeight: 0.1582, criticWeight: 0.1847, change: 16.7, correlation: 0.72 },
  { feature: 'DiastolicBP', entropyWeight: 0.1421, criticWeight: 0.1298, change: -8.7, correlation: 0.72 },
  { feature: 'Cholesterol', entropyWeight: 0.1987, criticWeight: 0.2124, change: 6.9, correlation: 0.31 },
  { feature: 'BMI', entropyWeight: 0.1563, criticWeight: 0.1432, change: -8.4, correlation: 0.51 },
  { feature: 'Age', entropyWeight: 0.1234, criticWeight: 0.1189, change: -3.6, correlation: 0.38 },
  { feature: 'Smoking', entropyWeight: 0.0892, criticWeight: 0.0956, change: 7.2, correlation: 0.22 },
  { feature: 'PhysicalActivity', entropyWeight: 0.0721, criticWeight: 0.0687, change: -4.7, correlation: 0.33 },
  { feature: 'Diabetes', entropyWeight: 0.0387, criticWeight: 0.0341, change: -11.9, correlation: 0.25 },
  { feature: 'FamilyHistory', entropyWeight: 0.0213, criticWeight: 0.0126, change: -40.8, correlation: 0.52 }
];

const performanceMetrics = [
  { metric: 'ROC-AUC', entropy: 0.7823, critic: 0.7912, better: 'critic', unit: '' },
  { metric: 'Sensitivity', entropy: 0.7145, critic: 0.7289, better: 'critic', unit: '' },
  { metric: 'Specificity', entropy: 0.6892, critic: 0.6954, better: 'critic', unit: '' },
  { metric: 'PPV', entropy: 0.6234, critic: 0.6412, better: 'critic', unit: '' },
  { metric: 'NPV', entropy: 0.7654, critic: 0.7734, better: 'critic', unit: '' },
  { metric: 'Brier Score', entropy: 0.1842, critic: 0.1721, better: 'critic', unit: '' }
];

interface WeightComparisonPanelProps {
  className?: string;
}

export function WeightComparisonPanel({ className = '' }: WeightComparisonPanelProps) {
  const [selectedMethod, setSelectedMethod] = useState<'entropy' | 'critic'>('critic');
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const getChangeColor = (change: number) => {
    if (Math.abs(change) < 5) return 'text-gray-500';
    return change > 0 ? 'text-green-600' : 'text-red-600';
  };

  const getCorrelationColor = (corr: number) => {
    if (corr >= 0.7) return 'bg-red-100 text-red-700';
    if (corr >= 0.5) return 'bg-yellow-100 text-yellow-700';
    if (corr >= 0.3) return 'bg-blue-100 text-blue-700';
    return 'bg-green-100 text-green-700';
  };

  return (
    <section ref={ref} className={className}>
      <FadeIn direction="up" duration={0.6}>
        <GlowCard glowColor="#6366f1" glowIntensity="medium" className="w-full">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3 mb-2">
                <motion.div
                  initial={{ rotate: -10, scale: 0.8 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20"
                >
                  <Scale className="h-6 w-6 text-purple-600" />
                </motion.div>
                <div>
                  <h2 className="text-2xl font-bold">
                    <GradientText from="#8b5cf6" to="#ec4899">Weight Method Comparison</GradientText>
                  </h2>
                  <p className="text-sm text-gray-500">CRITIC vs Entropy for Stage 2 Feature Weighting</p>
                </div>
              </div>
            </div>

            {/* Method Selector */}
            <div className="flex gap-3 mb-6">
              {(['entropy', 'critic'] as const).map((method) => (
                <button
                  key={method}
                  onClick={() => setSelectedMethod(method)}
                  className={`flex-1 p-4 rounded-xl border-2 transition-all duration-300 ${
                    selectedMethod === method
                      ? method === 'critic'
                        ? 'border-purple-400 bg-purple-50'
                        : 'border-blue-400 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <p className={`font-semibold ${selectedMethod === method ? 'text-gray-900' : 'text-gray-600'}`}>
                        {method === 'critic' ? 'CRITIC Method' : 'Entropy Method'}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {method === 'critic' ? 'Recommended - Better correlation handling' : 'Current default - Uses information entropy'}
                      </p>
                    </div>
                    {selectedMethod === method && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`p-1.5 rounded-full ${method === 'critic' ? 'bg-purple-500 text-white' : 'bg-blue-500 text-white'}`}
                      >
                        <Check className="h-4 w-4" />
                      </motion.div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <Tabs defaultValue="weights" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="weights" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Weights
                </TabsTrigger>
                <TabsTrigger value="performance" className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Performance
                </TabsTrigger>
                <TabsTrigger value="correlation" className="flex items-center gap-2">
                  <PieChart className="h-4 w-4" />
                  Correlation
                </TabsTrigger>
              </TabsList>

              {/* Weights Tab */}
              <TabsContent value="weights" className="space-y-4">
                <div className="space-y-3">
                  {weightComparisons.map((item, index) => {
                    const isPositiveChange = item.change > 0;
                    return (
                      <motion.div
                        key={item.feature}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <AnimatedBorder
                          colors={['#8b5cf6', '#ec4899', '#6366f1']}
                          duration={5}
                          className="w-full"
                        >
                          <div className="p-4 bg-white rounded-xl">
                            <div className="flex items-center justify-between mb-3">
                              <span className="font-semibold text-gray-800">{item.feature}</span>
                              <span className={`text-sm font-bold ${getChangeColor(item.change)}`}>
                                {item.change > 0 ? '+' : ''}{item.change.toFixed(1)}%
                              </span>
                            </div>
                            <div className="flex gap-3">
                              <div className="flex-1">
                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                  <span>Entropy</span>
                                  <span className="font-medium">{(item.entropyWeight * 100).toFixed(1)}%</span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${item.entropyWeight * 100 * 3}%` }}
                                    transition={{ delay: 0.2 + index * 0.05, duration: 0.5 }}
                                    className="h-full bg-blue-400 rounded-full"
                                  />
                                </div>
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                  <span>CRITIC</span>
                                  <span className="font-medium">{(item.criticWeight * 100).toFixed(1)}%</span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${item.criticWeight * 100 * 3}%` }}
                                    transition={{ delay: 0.3 + index * 0.05, duration: 0.5 }}
                                    className="h-full bg-purple-400 rounded-full"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </AnimatedBorder>
                      </motion.div>
                    );
                  })}
                </div>
              </TabsContent>

              {/* Performance Tab */}
              <TabsContent value="performance">
                <div className="space-y-4">
                  {/* Overall Recommendation */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 mb-6"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-green-100">
                        <Check className="h-5 w-5 text-green-600" />
                      </div>
                      <span className="font-bold text-green-800">CRITIC Recommended</span>
                    </div>
                    <p className="text-sm text-green-700">
                      CRITIC method shows modest but consistent improvement across all metrics,
                      particularly in PPV (+1.8%) and calibration (-6.6% Brier score).
                      Statistical significance: p &lt; 0.01 (McNemar's test).
                    </p>
                  </motion.div>

                  {performanceMetrics.map((metric, index) => (
                    <motion.div
                      key={metric.metric}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.08 }}
                      className="p-4 rounded-xl bg-gray-50 border border-gray-100"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-700">{metric.metric}</span>
                        {metric.better === 'critic' && (
                          <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">
                            CRITIC wins
                          </span>
                        )}
                      </div>
                      <div className="flex gap-6">
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-500">Entropy</span>
                            <span className="font-semibold">{metric.entropy.toFixed(4)}{metric.unit}</span>
                          </div>
                          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${metric.entropy * 100}%` }}
                              transition={{ delay: 0.2 + index * 0.05, duration: 0.5 }}
                              className={`h-full rounded-full ${metric.better === 'entropy' ? 'bg-blue-400' : 'bg-gray-400'}`}
                            />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-500">CRITIC</span>
                            <span className="font-semibold">{metric.critic.toFixed(4)}{metric.unit}</span>
                          </div>
                          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${metric.critic * 100}%` }}
                              transition={{ delay: 0.3 + index * 0.05, duration: 0.5 }}
                              className={`h-full rounded-full ${metric.better === 'critic' ? 'bg-purple-400' : 'bg-gray-400'}`}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              {/* Correlation Tab */}
              <TabsContent value="correlation">
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 mb-4">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">Why CRITIC Differs from Entropy</p>
                        <p>
                          CRITIC considers both <strong>contrast intensity</strong> (standard deviation)
                          and <strong>conflict</strong> (correlation with other criteria). Features
                          highly correlated with others get reduced weight to avoid double-counting.
                        </p>
                      </div>
                    </div>
                  </div>

                  {weightComparisons.filter(w => w.correlation !== undefined).map((item, index) => (
                    <motion.div
                      key={item.feature}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-4 p-3 rounded-xl bg-gray-50"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{item.feature}</p>
                      </div>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${getCorrelationColor(item.correlation || 0)}`}>
                        r = {item.correlation?.toFixed(2)}
                      </span>
                      <div className="w-24">
                        <span className={`text-sm font-bold ${item.change < 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {item.change > 0 ? '+' : ''}{item.change.toFixed(0)}%
                        </span>
                        <span className="text-xs text-gray-400 ml-1">vs entropy</span>
                      </div>
                    </motion.div>
                  ))}

                  <div className="p-4 rounded-xl border border-gray-200 mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Key Insights:</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• <strong>SystolicBP & DiastolicBP</strong> (r=0.72): High correlation → CRITIC gives more weight to independent signal</li>
                      <li>• <strong>Age & FamilyHistory</strong> (r=0.52): Moderate correlation → CRITIC reduces FamilyHistory weight</li>
                      <li>• <strong>Cholesterol</strong> (r=0.31): Low correlation → CRITIC increases weight for independent information</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </GlowCard>
      </FadeIn>
    </section>
  );
}
