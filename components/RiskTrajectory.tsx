'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Clock, Calendar, ChevronRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from 'recharts';
import { AnimatedNumber } from '@/components/animations/AnimatedNumber';
import { GlowCard } from '@/components/animations/GlowCard';
import { FadeIn, StaggeredFadeIn } from '@/components/animations/FadeIn';

export interface AssessmentHistoryItem {
  date: string;
  riskPercent: number;
  category: 'Low' | 'Moderate' | 'High';
}

interface RiskTrajectoryProps {
  history: AssessmentHistoryItem[];
  currentRisk: number;
  currentDate?: string;
}

const riskColors = {
  Low: { stroke: '#22c55e', fill: '#22c55e20', glow: '#22c55e' },
  Moderate: { stroke: '#eab308', fill: '#eab30820', glow: '#eab308' },
  High: { stroke: '#ef4444', fill: '#ef444420', glow: '#ef4444' }
};

export function RiskTrajectory({ history, currentRisk, currentDate = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) }: RiskTrajectoryProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [animatedHistory, setAnimatedHistory] = useState<AssessmentHistoryItem[]>([]);

  const lastAssessment = history.length > 1 ? history[history.length - 2] : null;
  const trend = lastAssessment ? currentRisk - lastAssessment.riskPercent : 0;
  const trendPercent = lastAssessment ? ((trend / lastAssessment.riskPercent) * 100).toFixed(1) : '0';

  const isIncreasing = trend > 0;
  const trendColor = isIncreasing ? { text: 'text-red-500', bg: 'bg-red-50 border-red-200', icon: TrendingUp } : { text: 'text-green-500', bg: 'bg-green-50 border-green-200', icon: TrendingDown };
  const currentCategory = currentRisk < 25 ? 'Low' : currentRisk < 45 ? 'Moderate' : 'High';
  const colorScheme = riskColors[currentCategory as keyof typeof riskColors];

  useEffect(() => {
    setAnimatedHistory([]);
    const timer = setTimeout(() => {
      setAnimatedHistory(history);
    }, 300);
    return () => clearTimeout(timer);
  }, [history]);

  const getCategoryBadge = (category: string) => {
    const colors = {
      Low: 'bg-green-100 text-green-700 border-green-300',
      Moderate: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      High: 'bg-red-100 text-red-700 border-red-300'
    };
    return colors[category as keyof typeof colors] || colors.Low;
  };

  return (
    <section ref={sectionRef} className="relative">
      <FadeIn direction="up" duration={0.6}>
        <GlowCard
          glowColor={colorScheme.glow}
          glowIntensity="medium"
          className="w-full"
        >
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <motion.div
                    initial={{ rotate: -10, scale: 0.8 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20"
                  >
                    <TrendingUp className={`h-6 w-6 ${isIncreasing ? trendColor.text : 'text-blue-500'}`} />
                  </motion.div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
                    Risk Trajectory
                  </h2>
                </div>
                <p className="text-sm text-gray-500">Historical cardiovascular risk assessment over time</p>
              </div>

              {/* Trend Badge */}
              {trend !== 0 && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, type: 'spring' }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border ${trendColor.bg}`}
                >
                  {React.createElement(trendColor.icon, { className: `h-4 w-4 ${trendColor.text}` })}
                  <span className={`font-semibold ${trendColor.text}`}>
                    {isIncreasing ? '+' : '-'}{Math.abs(trend).toFixed(1)}%
                  </span>
                  <span className="text-xs text-gray-500">({trendPercent}%)</span>
                </motion.div>
              )}
            </div>

            {/* Trend Message */}
            {trend !== 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.3 }}
                className={`mb-6 p-4 rounded-xl border ${isIncreasing ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}
              >
                <p className={`text-sm ${isIncreasing ? 'text-red-700' : 'text-green-700'}`}>
                  {isIncreasing ? (
                    <>
                      Your risk has <strong>increased</strong> since your last assessment.
                      Consider reviewing lifestyle factors and scheduling a follow-up.
                    </>
                  ) : (
                    <>
                      Your risk has <strong>decreased {Math.abs(parseFloat(trendPercent)).toFixed(0)}%</strong> since last assessment —
                      keep up the excellent work maintaining your cardiovascular health!
                    </>
                  )}
                </p>
              </motion.div>
            )}

            {/* Chart */}
            <div className="h-[220px] w-full mb-6 relative">
              <AnimatePresence mode="wait">
                {animatedHistory.length > 0 ? (
                  <motion.div
                    key="chart"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="h-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={animatedHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id={`gradient-${currentCategory}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={colorScheme.stroke} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={colorScheme.stroke} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis
                          dataKey="date"
                          tick={{ fontSize: 11, fill: '#6b7280' }}
                          axisLine={false}
                          tickLine={false}
                          tickFormatter={(value) => {
                            const date = new Date(value);
                            return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
                          }}
                        />
                        <YAxis
                          domain={[0, 100]}
                          tick={{ fontSize: 11, fill: '#6b7280' }}
                          axisLine={false}
                          tickLine={false}
                          unit="%"
                        />
                        <Tooltip
                          formatter={(value: number) => [`${value.toFixed(1)}%`, 'Risk']}
                          contentStyle={{
                            borderRadius: '12px',
                            border: '1px solid #e5e7eb',
                            backgroundColor: 'rgba(255,255,255,0.95)',
                            backdropFilter: 'blur(10px)',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                          }}
                          labelFormatter={(label) => {
                            const date = new Date(label);
                            return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
                          }}
                        />
                        <ReferenceLine y={25} stroke="#22c55e" strokeDasharray="4 4" strokeOpacity={0.4} label={{ value: 'Low', position: 'left', fill: '#22c55e', fontSize: 10 }} />
                        <ReferenceLine y={45} stroke="#eab308" strokeDasharray="4 4" strokeOpacity={0.4} label={{ value: 'High', position: 'left', fill: '#eab308', fontSize: 10 }} />
                        <Area
                          type="monotone"
                          dataKey="riskPercent"
                          stroke={colorScheme.stroke}
                          strokeWidth={3}
                          fill={`url(#gradient-${currentCategory})`}
                          dot={{
                            fill: colorScheme.stroke,
                            strokeWidth: 2,
                            r: 5,
                            stroke: '#fff'
                          }}
                          activeDot={{
                            r: 8,
                            fill: colorScheme.stroke,
                            stroke: '#fff',
                            strokeWidth: 3
                          }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </motion.div>
                ) : (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex items-center justify-center"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                      <p className="text-sm text-gray-500">Loading trajectory...</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-6 mb-6 text-xs">
              {[
                { label: 'Low (<25%)', color: '#22c55e' },
                { label: 'Moderate (25-45%)', color: '#eab308' },
                { label: 'High (≥45%)', color: '#ef4444' }
              ].map(({ label, color }) => (
                <span key={label} className="flex items-center gap-1.5 text-gray-500">
                  <span className="w-3 h-0.5 rounded-full" style={{ backgroundColor: color }} />
                  {label}
                </span>
              ))}
            </div>

            {/* History List */}
            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5" />
                  Assessment History
                </p>
                <button className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors">
                  View All <ChevronRight className="h-3 w-3" />
                </button>
              </div>

              <StaggeredFadeIn staggerDelay={0.08} className="space-y-2">
                {history.slice(-5).reverse().map((item, index) => {
                  const isLatest = index === 0;
                  return (
                    <motion.div
                      key={item.date}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex items-center justify-between p-3 rounded-xl transition-all ${isLatest ? 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/50' : 'bg-gray-50/50 hover:bg-gray-100/50'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${isLatest ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'}`} />
                        <span className="text-sm text-gray-600">
                          {new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                        {isLatest && (
                          <span className="text-[10px] font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                            Current
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-gray-800">
                          {item.riskPercent.toFixed(1)}%
                        </span>
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${getCategoryBadge(item.category)}`}>
                          {item.category}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </StaggeredFadeIn>
            </div>

            {/* Next Assessment */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Next scheduled assessment</p>
                    <p className="font-semibold text-gray-800">
                      {(() => {
                        const lastDate = new Date(history[history.length - 1]?.date || currentDate);
                        lastDate.setMonth(lastDate.getMonth() + (currentCategory === 'High' ? 1 : currentCategory === 'Moderate' ? 3 : 6));
                        return lastDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
                      })()}
                    </p>
                  </div>
                </div>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
                  Schedule Now
                </button>
              </div>
            </motion.div>
          </div>
        </GlowCard>
      </FadeIn>
    </section>
  );
}
