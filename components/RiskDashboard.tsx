'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { RiskTrajectory, type AssessmentHistoryItem } from './RiskTrajectory';
import { ActionProtocol } from './ActionProtocol';
import { GlowCard } from '@/components/animations/GlowCard';
import { FloatingOrb } from '@/components/animations/FloatingOrb';
import { FadeIn, StaggeredFadeIn } from '@/components/animations/FadeIn';

type RiskLevel = 'Low' | 'Moderate' | 'High';

interface RiskDashboardProps {
  riskLevel: RiskLevel;
  currentRisk: number;
  history?: AssessmentHistoryItem[];
  className?: string;
}

export function RiskDashboard({
  riskLevel,
  currentRisk,
  history = [],
  className = ''
}: RiskDashboardProps) {
  const defaultHistory: AssessmentHistoryItem[] = history.length > 0 ? history : [
    {
      date: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
      riskPercent: currentRisk * 0.8,
      category: 'Moderate'
    },
    {
      date: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString(),
      riskPercent: currentRisk * 0.85,
      category: 'Moderate'
    },
    {
      date: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
      riskPercent: currentRisk * 0.9,
      category: 'Moderate'
    },
    {
      date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      riskPercent: currentRisk * 0.95,
      category: 'Moderate'
    },
    {
      date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      riskPercent: currentRisk,
      category: riskLevel
    }
  ];

  const riskColors = {
    Low: { primary: '#22c55e', secondary: '#16a34a', bg: 'from-green-50 to-emerald-50' },
    Moderate: { primary: '#eab308', secondary: '#ca8a04', bg: 'from-yellow-50 to-amber-50' },
    High: { primary: '#ef4444', secondary: '#dc2626', bg: 'from-red-50 to-rose-50' }
  };

  const colors = riskColors[riskLevel];

  return (
    <section className={`relative ${className}`}>
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <FloatingOrb
          size={200}
          color={colors.primary}
          blur={80}
          speed={0.5}
          className="absolute -top-20 -right-20 opacity-20"
        />
        <FloatingOrb
          size={150}
          color={colors.secondary}
          blur={60}
          speed={0.7}
          className="absolute -bottom-10 -left-10 opacity-15"
        />
      </div>

      <div className="relative z-10 space-y-8">
        {/* Section Header */}
        <FadeIn direction="up" duration={0.5}>
          <div className="text-center mb-8">
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold mb-3"
            >
              <span
                className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-gray-100 dark:via-gray-300 dark:to-gray-100 bg-clip-text text-transparent"
              >
                Clinical Action Plan
              </span>
            </motion.h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Personalized cardiovascular risk management based on your assessment results.
              Follow the recommended protocol for your risk level.
            </p>
          </div>
        </FadeIn>

        {/* Risk Trajectory */}
        {defaultHistory.length > 1 && (
          <FadeIn direction="up" duration={0.6} delay={0.1}>
            <RiskTrajectory
              history={defaultHistory}
              currentRisk={currentRisk}
            />
          </FadeIn>
        )}

        {/* Action Protocol */}
        <FadeIn direction="up" duration={0.6} delay={0.2}>
          <ActionProtocol riskLevel={riskLevel} />
        </FadeIn>

        {/* Quick Stats */}
        <StaggeredFadeIn staggerDelay={0.15} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              label: 'Current Risk',
              value: `${currentRisk.toFixed(1)}%`,
              icon: '📊',
              color: colors.primary,
              bg: colors.bg
            },
            {
              label: 'Risk Category',
              value: riskLevel,
              icon: '🎯',
              color: colors.primary,
              bg: colors.bg
            },
            {
              label: 'Next Assessment',
              value: riskLevel === 'High' ? '1 month' : riskLevel === 'Moderate' ? '3 months' : '6 months',
              icon: '📅',
              color: colors.primary,
              bg: colors.bg
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1, type: 'spring' }}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <GlowCard glowColor={stat.color} glowIntensity="low" className="w-full">
                <div className={`p-5 rounded-xl bg-gradient-to-br ${stat.bg}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{stat.icon}</span>
                    <span className="text-sm text-gray-500 font-medium">{stat.label}</span>
                  </div>
                  <p className="text-2xl font-bold" style={{ color: stat.color }}>
                    {stat.value}
                  </p>
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </StaggeredFadeIn>
      </div>
    </section>
  );
}
