'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Clock, AlertTriangle, CheckCircle2, Stethoscope, Activity, Pill, FileText, Heart, Brain, Users, Calendar, ArrowRight } from 'lucide-react';
import { GlowCard } from '@/components/animations/GlowCard';
import { FadeIn, StaggeredFadeIn } from '@/components/animations/FadeIn';
import { PulsingRing } from '@/components/animations/FloatingOrb';
import { AnimatedBorder } from '@/components/animations/BorderEffects';

type RiskLevel = 'Low' | 'Moderate' | 'High';
type Urgency = 'routine' | 'soon' | 'urgent';

interface ActionItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  details: string[];
  urgency: Urgency;
  timeline: string;
  guidelineRef?: string;
}

interface ActionProtocolProps {
  riskLevel: RiskLevel;
  className?: string;
}

const urgencyConfig = {
  routine: {
    color: 'text-gray-600',
    bg: 'bg-gray-100',
    border: 'border-gray-200',
    badge: 'bg-gray-100 text-gray-600',
    pulse: false,
    label: 'Routine'
  },
  soon: {
    color: 'text-yellow-600',
    bg: 'bg-yellow-100',
    border: 'border-yellow-200',
    badge: 'bg-yellow-100 text-yellow-700',
    pulse: true,
    label: 'Within 1-4 weeks'
  },
  urgent: {
    color: 'text-red-600',
    bg: 'bg-red-100',
    border: 'border-red-200',
    badge: 'bg-red-100 text-red-700',
    pulse: true,
    label: 'Urgent'
  }
};

const protocols: Record<RiskLevel, {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  gradient: [string, string];
  glowColor: string;
  actions: ActionItem[];
}> = {
  Low: {
    title: 'Low Risk Protocol',
    subtitle: 'Cardiovascular risk is well-controlled. Maintain healthy lifestyle habits.',
    icon: <CheckCircle2 className="h-7 w-7" />,
    gradient: ['#22c55e', '#16a34a'],
    glowColor: '#22c55e',
    actions: [
      {
        id: 'maintain-lifestyle',
        icon: <Heart className="h-5 w-5" />,
        title: 'Maintain Healthy Lifestyle',
        description: 'Continue your current healthy habits for long-term cardiovascular wellness.',
        details: [
          'Regular physical activity: 150 min/week moderate exercise',
          'Balanced Mediterranean-style diet',
          'Adequate sleep: 7-8 hours per night',
          'Stress management and mindfulness practices'
        ],
        urgency: 'routine',
        timeline: 'Ongoing',
        guidelineRef: 'ACC/AHA Primary Prevention Guidelines 2019'
      },
      {
        id: 'annual-checkup',
        icon: <Calendar className="h-5 w-5" />,
        title: 'Annual Cardiovascular Screening',
        description: 'Schedule yearly comprehensive cardiovascular assessment.',
        details: [
          'Blood pressure measurement',
          'Lipid profile (fasting or non-fasting)',
          'Blood glucose screening',
          'Body weight and BMI assessment'
        ],
        urgency: 'routine',
        timeline: 'Every 12 months'
      },
      {
        id: 'family-education',
        icon: <Users className="h-5 w-5" />,
        title: 'Family Health Education',
        description: 'Share cardiovascular health knowledge with family members.',
        details: [
          'Discuss family history of heart disease',
          'Encourage healthy lifestyle habits in family',
          'Share warning signs of heart attack and stroke',
          'Promote regular check-ups for family members'
        ],
        urgency: 'routine',
        timeline: 'Ongoing'
      }
    ]
  },
  Moderate: {
    title: 'Moderate Risk Protocol',
    subtitle: 'Cardiovascular risk requires attention and lifestyle modification. Follow-up assessment needed.',
    icon: <AlertTriangle className="h-7 w-7" />,
    gradient: ['#eab308', '#ca8a04'],
    glowColor: '#eab308',
    actions: [
      {
        id: 'ecg-baseline',
        icon: <Activity className="h-5 w-5" />,
        title: 'Baseline ECG',
        description: 'Perform 12-lead electrocardiogram to establish cardiac baseline.',
        details: [
          'Detects silent arrhythmias or conduction abnormalities',
          'Establishes baseline for future comparisons',
          'Identifies left ventricular hypertrophy pattern',
          'Non-invasive, takes ~10 minutes'
        ],
        urgency: 'soon',
        timeline: 'Within 1 month',
        guidelineRef: 'ESC 2021 Cardiovascular Prevention'
      },
      {
        id: 'lifestyle-counseling',
        icon: <Brain className="h-5 w-5" />,
        title: 'Lifestyle Modification Counseling',
        description: 'Structured intervention for risk factor reduction.',
        details: [
          'Smoking cessation: Nicotine replacement therapy if needed',
          'DASH diet adoption: Increase fruits, vegetables, whole grains',
          'Physical activity: Escalate to 180 min/week if able',
          'Weight management: Target 5-10% reduction if overweight'
        ],
        urgency: 'soon',
        timeline: 'Within 2 weeks'
      },
      {
        id: 'statin-evaluation',
        icon: <Pill className="h-5 w-5" />,
        title: 'Evaluate Statin Therapy',
        description: 'Consider statin therapy based on risk assessment.',
        details: [
          'Calculate 10-year ASCVD risk using pooled cohort equations',
          'Moderate-intensity statin recommended if risk ≥7.5%',
          'Monitor LDL-C levels at 12 weeks after starting',
          'Assess for statin-associated side effects'
        ],
        urgency: 'soon',
        timeline: 'Discuss at next visit'
      },
      {
        id: 'followup-reassessment',
        icon: <Calendar className="h-5 w-5" />,
        title: 'Follow-up Reassessment',
        description: 'Repeat cardiovascular risk assessment to evaluate interventions.',
        details: [
          'Repeat risk calculation with updated parameters',
          'Assess adherence to lifestyle modifications',
          'Evaluate medication tolerance and side effects',
          'Adjust management plan based on results'
        ],
        urgency: 'routine',
        timeline: 'Every 6 months'
      }
    ]
  },
  High: {
    title: 'High Risk Protocol',
    subtitle: 'High cardiovascular risk requires prompt specialist evaluation and pharmacological intervention.',
    icon: <AlertTriangle className="h-7 w-7" />,
    gradient: ['#ef4444', '#dc2626'],
    glowColor: '#ef4444',
    actions: [
      {
        id: 'cardiology-referral',
        icon: <Stethoscope className="h-5 w-5" />,
        title: 'Urgent Cardiology Referral',
        description: 'Refer to cardiologist within 2 weeks for comprehensive evaluation.',
        details: [
          '12-lead ECG and interpretation',
          'Stress testing (exercise or pharmacologic)',
          'Echocardiography if symptomatic',
          'Coronary artery calcium (CAC) scoring',
          'Consideration for advanced imaging (CT coronary angiography)'
        ],
        urgency: 'urgent',
        timeline: 'Within 2 weeks',
        guidelineRef: 'ESC 2021 NSTE-ACS Guidelines'
      },
      {
        id: 'lipid-profile',
        icon: <Activity className="h-5 w-5" />,
        title: 'Complete Lipid Panel',
        description: 'Comprehensive lipid analysis is critical for treatment planning.',
        details: [
          'Total cholesterol, LDL-C (direct if TG > 400)',
          'HDL-C (higher is protective)',
          'Triglycerides (fasting preferred)',
          'Non-HDL-C as secondary target < 100 mg/dL'
        ],
        urgency: 'urgent',
        timeline: 'Within 1 week'
      },
      {
        id: 'statin-therapy',
        icon: <Pill className="h-5 w-5" />,
        title: 'Initiate High-Intensity Statin Therapy',
        description: 'Start pharmacotherapy immediately per ACC/AHA guidelines.',
        details: [
          'Atorvastatin 40-80 mg OR Rosuvastatin 20-40 mg',
          'Target LDL-C < 70 mg/dL for high-risk patients',
          'Consider PCSK9 inhibitor if LDL not at target at 12 weeks',
          'Monitor LFTs at 12 weeks, CK if symptomatic'
        ],
        urgency: 'urgent',
        timeline: 'Start at this visit',
        guidelineRef: 'ACC/AHA 2018 Cholesterol Guidelines'
      },
      {
        id: 'bp-optimization',
        icon: <Heart className="h-5 w-5" />,
        title: 'Blood Pressure Optimization',
        description: 'If hypertensive, aggressive BP control is essential.',
        details: [
          'Target BP: < 130/80 mmHg per 2017 ACC/AHA guideline',
          'First-line: ACE inhibitor or ARB',
          'Add CCB or thiazide diuretic if needed',
          'Home BP monitoring recommended'
        ],
        urgency: 'urgent',
        timeline: 'Within 2 weeks'
      },
      {
        id: 'lifestyle-intensive',
        icon: <Brain className="h-5 w-5" />,
        title: 'Intensive Lifestyle Intervention',
        description: 'Major lifestyle changes are essential alongside medications.',
        details: [
          'Complete smoking cessation: Nicotine replacement + counseling',
          'Major dietary changes: DASH or Mediterranean diet',
          'Supervised exercise program: Cardiac rehabilitation referral',
          'Limit alcohol: ≤ 2 drinks/day (men), ≤ 1 drink/day (women)',
          'Weight reduction if BMI ≥ 25: Target 5-10% reduction'
        ],
        urgency: 'soon',
        timeline: 'Start immediately'
      }
    ]
  }
};

function ActionCard({ action, index, isExpanded, onToggle }: {
  action: ActionItem;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const config = urgencyConfig[action.urgency];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, type: 'spring', stiffness: 100, damping: 15 }}
    >
      <AnimatedBorder
        colors={[config.color.includes('red') ? '#ef4444' : config.color.includes('yellow') ? '#eab308' : '#6b7280', '#6366f1', '#06b6d4']}
        duration={4}
        className="w-full"
      >
        <div
          className={`relative p-4 rounded-xl cursor-pointer transition-all duration-300 ${isExpanded ? 'bg-white' : 'bg-white/80 hover:bg-white'}`}
          onClick={onToggle}
        >
          {/* Urgency Indicator */}
          <div className="absolute -left-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {config.pulse && (
              <PulsingRing size={24} color={config.color.includes('red') ? '#ef4444' : '#eab308'} />
            )}
          </div>

          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className={`p-3 rounded-xl ${config.bg} ${config.color}`}
              >
                {action.icon}
              </motion.div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-gray-900">{action.title}</h3>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${config.badge} ${config.border}`}>
                    {config.pulse && <span className="inline-block w-1.5 h-1.5 rounded-full bg-current mr-1 animate-pulse" />}
                    {config.label}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{action.description}</p>
              </div>
            </div>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className={`p-2 rounded-lg ${isExpanded ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-400'}`}
            >
              <ChevronUp className={`h-5 w-5 transition-transform duration-200 ${!isExpanded && 'rotate-180'}`} />
            </motion.div>
          </div>

          {/* Expanded Content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="mt-4 pt-4 border-t border-gray-100">
                  {/* Details List */}
                  <ul className="space-y-2 mb-4">
                    {action.details.map((detail, i) => (
                      <motion.li
                        key={i}
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-start gap-2 text-sm text-gray-700"
                      >
                        <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${config.color.includes('red') ? 'bg-red-400' : config.color.includes('yellow') ? 'bg-yellow-400' : 'bg-gray-400'}`} />
                        {detail}
                      </motion.li>
                    ))}
                  </ul>

                  {/* Timeline & Guideline */}
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className={`h-4 w-4 ${config.color}`} />
                      <span className={`font-medium ${config.color}`}>{action.timeline}</span>
                    </div>
                    {action.guidelineRef && (
                      <span className="text-xs text-gray-400 italic">{action.guidelineRef}</span>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </AnimatedBorder>
    </motion.div>
  );
}

export function ActionProtocol({ riskLevel, className = '' }: ActionProtocolProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const protocol = protocols[riskLevel];
  const displayedActions = showAll ? protocol.actions : protocol.actions.slice(0, 3);

  return (
    <section ref={ref} className={className}>
      <FadeIn direction="up" duration={0.6} delay={0.2}>
        <GlowCard glowColor={protocol.glowColor} glowIntensity={riskLevel === 'High' ? 'high' : 'medium'} className="w-full">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <motion.div
                initial={{ scale: 0.8, rotate: -5 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="p-3 rounded-2xl"
                style={{
                  background: `linear-gradient(135deg, ${protocol.gradient[0]}20, ${protocol.gradient[1]}20)`,
                  color: protocol.gradient[0]
                }}
              >
                {protocol.icon}
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold" style={{ color: protocol.gradient[0] }}>
                  {protocol.title}
                </h2>
                <p className="text-sm text-gray-500 mt-1">{protocol.subtitle}</p>
              </div>
            </div>

            {/* Actions Grid */}
            <StaggeredFadeIn staggerDelay={0.1} className="space-y-4">
              {displayedActions.map((action, index) => (
                <ActionCard
                  key={action.id}
                  action={action}
                  index={index}
                  isExpanded={expandedId === action.id}
                  onToggle={() => setExpandedId(expandedId === action.id ? null : action.id)}
                />
              ))}
            </StaggeredFadeIn>

            {/* Show More/Less */}
            {protocol.actions.length > 3 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-6 text-center"
              >
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200/50 hover:border-blue-300 hover:from-blue-500/20 hover:to-purple-500/20 transition-all duration-300"
                >
                  <span className="text-sm font-medium text-blue-600 group-hover:text-blue-700">
                    {showAll ? 'Show Less' : `Show ${protocol.actions.length - 3} More Actions`}
                  </span>
                  <motion.div
                    animate={{ rotate: showAll ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="h-4 w-4 text-blue-500" />
                  </motion.div>
                </button>
              </motion.div>
            )}

            {/* Clinical Note */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className={`mt-6 p-4 rounded-xl border ${riskLevel === 'High' ? 'bg-red-50 border-red-200' : riskLevel === 'Moderate' ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'}`}
            >
              <div className="flex items-start gap-3">
                <FileText className={`h-5 w-5 flex-shrink-0 mt-0.5 ${riskLevel === 'High' ? 'text-red-500' : riskLevel === 'Moderate' ? 'text-yellow-600' : 'text-green-600'}`} />
                <div>
                  <p className="text-sm font-medium text-gray-800 mb-1">Clinical Documentation Note</p>
                  <p className="text-xs text-gray-600">
                    This action plan is generated based on the patient's cardiovascular risk assessment.
                    Clinical judgment should always be applied when making treatment decisions.
                    Refer to current guidelines (ACC/AHA, ESC) for complete recommendations.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </GlowCard>
      </FadeIn>
    </section>
  );
}
