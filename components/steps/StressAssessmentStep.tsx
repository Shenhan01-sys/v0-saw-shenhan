'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ChevronRight, ChevronLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { GlowCard } from '@/components/animations/GlowCard';
import { FadeIn } from '@/components/animations/FadeIn';
import { AnimatedNumber } from '@/components/animations/AnimatedNumber';
import { GradientText } from '@/components/animations/ShimmerText';

interface StressQuestion {
  id: number;
  question: string;
  options: { value: number; label: string; color: string }[];
}

const stressQuestions: StressQuestion[] = [
  {
    id: 1,
    question: 'Dalam 4 minggu terakhir, seberapa sering Anda merasa tegang atau stres?',
    options: [
      { value: 0, label: 'Tidak pernah', color: '#22c55e' },
      { value: 1, label: 'Jarang', color: '#84cc16' },
      { value: 2, label: 'Kadang-kadang', color: '#eab308' },
      { value: 3, label: 'Sering', color: '#f97316' },
      { value: 4, label: 'Sangat sering', color: '#ef4444' }
    ]
  },
  {
    id: 2,
    question: 'Dalam 4 minggu terakhir, seberapa sering Anda merasa tidak mampu mengontrol hal-hal penting dalam hidup Anda?',
    options: [
      { value: 0, label: 'Tidak pernah', color: '#22c55e' },
      { value: 1, label: 'Jarang', color: '#84cc16' },
      { value: 2, label: 'Kadang-kadang', color: '#eab308' },
      { value: 3, label: 'Sering', color: '#f97316' },
      { value: 4, label: 'Sangat sering', color: '#ef4444' }
    ]
  }
];

interface StressAssessmentStepProps {
  answers: (number | null)[];
  onChange: (answers: (number | null)[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StressAssessmentStep({ answers, onChange, onNext, onBack }: StressAssessmentStepProps) {
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [selectedValues, setSelectedValues] = useState<(number | null)[]>(answers[0] !== null || answers[1] !== null ? [...answers] : [null, null]);

  const currentQuestion = stressQuestions[activeQuestion];
  const totalScore = selectedValues.reduce((sum: number, val) => sum + (val ?? 0), 0);
  const maxScore = 8;
  const isElevated = totalScore > 4;
  const allAnswered = selectedValues.every(v => v !== null);

  const handleSelect = (value: number) => {
    const newAnswers = [...selectedValues];
    newAnswers[activeQuestion] = value;
    setSelectedValues(newAnswers);
    onChange(newAnswers);
  };

  const getStressLevel = () => {
    if (totalScore <= 2) return { label: 'Normal', color: '#22c55e', description: 'Tingkat stres Anda dalam batas normal.' };
    if (totalScore <= 4) return { label: 'Ringan', color: '#84cc16', description: 'Tingkat stres ringan. Tetap jaga keseimbangan hidup.' };
    if (totalScore <= 6) return { label: 'Sedang', color: '#eab308', description: 'Tingkat stres sedang. Pertimbangkan teknik manajemen stres.' };
    if (totalScore <= 8) return { label: 'Tinggi', color: '#f97316', description: 'Tingkat stres tinggi. Sebaiknya konsultasikan dengan profesional.' };
    return { label: 'Sangat Tinggi', color: '#ef4444', description: 'Tingkat stres sangat tinggi. Segera cari bantuan profesional.' };
  };

  const stressLevel = getStressLevel();

  return (
    <div className="w-full max-w-lg mx-auto">
      <FadeIn direction="up" duration={0.5}>
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 mb-4"
          >
            <Brain className="h-8 w-8 text-purple-600" />
          </motion.div>
          <h2 className="text-2xl font-bold mb-2">
            <GradientText from="#8b5cf6" to="#ec4899">Penilaian Stres</GradientText>
          </h2>
          <p className="text-gray-500 text-sm">
            Jawab pertanyaan berikut untuk menilai tingkat stres kronis Anda
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {stressQuestions.map((_, index) => (
            <motion.div
              key={index}
              animate={{
                scale: activeQuestion === index ? 1.2 : 1,
                backgroundColor: selectedValues[index] !== null ? '#6366f1' : '#e5e7eb'
              }}
              className="w-3 h-3 rounded-full"
            />
          ))}
        </div>

        {/* Question Card */}
        <GlowCard glowColor={isElevated ? '#ef4444' : '#6366f1'} glowIntensity={isElevated ? 'medium' : 'low'} className="mb-6">
          <div className="p-6">
            {/* Question Number */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-100 text-purple-700">
                Pertanyaan {currentQuestion.id} dari {stressQuestions.length}
              </span>
              {selectedValues[activeQuestion] !== null && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-1 text-xs font-medium text-green-600"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Terjawab
                </motion.div>
              )}
            </div>

            {/* Question Text */}
            <motion.h3
              key={activeQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-lg font-semibold text-gray-800 mb-6"
            >
              {currentQuestion.question}
            </motion.h3>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedValues[activeQuestion] === option.value;
                return (
                  <motion.button
                    key={option.value}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.01, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelect(option.value)}
                    className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                      isSelected
                        ? 'border-2 shadow-md'
                        : 'border border-gray-200 hover:border-gray-300'
                    }`}
                    style={{
                      borderColor: isSelected ? option.color : undefined,
                      backgroundColor: isSelected ? `${option.color}15` : undefined
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <motion.div
                        animate={{
                          scale: isSelected ? 1.1 : 1,
                          backgroundColor: isSelected ? option.color : '#f3f4f6'
                        }}
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
                        style={{
                          color: isSelected ? 'white' : '#6b7280'
                        }}
                      >
                        {option.value}
                      </motion.div>
                      <span
                        className="font-medium"
                        style={{ color: isSelected ? option.color : '#374151' }}
                      >
                        {option.label}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </GlowCard>

        {/* Navigation */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setActiveQuestion(Math.max(0, activeQuestion - 1))}
            disabled={activeQuestion === 0}
            className={`flex items-center justify-center gap-2 py-3 px-6 rounded-xl border font-medium transition-all ${
              activeQuestion === 0
                ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                : 'border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
            }`}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>
          <button
            onClick={() => {
              if (activeQuestion < stressQuestions.length - 1) {
                setActiveQuestion(activeQuestion + 1);
              } else {
                onNext();
              }
            }}
            disabled={selectedValues[activeQuestion] === null}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-medium transition-all ${
              selectedValues[activeQuestion] !== null
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {activeQuestion < stressQuestions.length - 1 ? 'Next' : 'See Results'}
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Results Preview */}
        {allAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-5 rounded-xl border-2 ${
              isElevated
                ? 'bg-red-50 border-red-200'
                : 'bg-green-50 border-green-200'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-600">Total Skor Stres</span>
              <span
                className="text-2xl font-bold"
                style={{ color: stressLevel.color }}
              >
                {totalScore} <span className="text-sm font-normal text-gray-400">/ {maxScore}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="flex-1 h-2 rounded-full overflow-hidden"
                style={{ backgroundColor: `${stressLevel.color}20` }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(totalScore / maxScore) * 100}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: stressLevel.color }}
                />
              </div>
              {isElevated && (
                <AlertCircle className="h-5 w-5 text-red-500 animate-pulse" />
              )}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span
                className="text-sm font-bold px-2.5 py-1 rounded-full"
                style={{ backgroundColor: `${stressLevel.color}20`, color: stressLevel.color }}
              >
                {stressLevel.label}
              </span>
              <span className="text-sm text-gray-600">{stressLevel.description}</span>
            </div>
          </motion.div>
        )}
      </FadeIn>
    </div>
  );
}
