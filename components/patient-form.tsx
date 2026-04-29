'use client';

import React, { useState } from 'react';
import { PatientData, ageToCategory, validatePatientData } from '@/lib/saw-engine';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';

interface PatientFormProps {
  onSubmit: (data: PatientData) => void;
  isLoading?: boolean;
}

type FormState = {
  age: number;
  bmi: number;
  sleepTime: number;
  smoking: 0 | 1;
  alcoholDrinking: 0 | 1;
  physicalActivity: 0 | 1;
  genHealth: number;
  physicalHealth: number;
  mentalHealth: number;
  diffWalking: 0 | 1;
  stroke: 0 | 1;
  diabetic: 0 | 1;
  asthma: 0 | 1;
  kidneyDisease: 0 | 1;
  skinCancer: 0 | 1;
  systolicBP: number;
  diastolicBP: number;
  cholesterol: 1 | 2 | 3;
  glucose: 1 | 2 | 3;
};

const DEFAULTS: FormState = {
  age: 45,
  bmi: 23,
  sleepTime: 7,
  smoking: 0,
  alcoholDrinking: 0,
  physicalActivity: 1,
  genHealth: 3,
  physicalHealth: 0,
  mentalHealth: 0,
  diffWalking: 0,
  stroke: 0,
  diabetic: 0,
  asthma: 0,
  kidneyDisease: 0,
  skinCancer: 0,
  systolicBP: 110,
  diastolicBP: 70,
  cholesterol: 1,
  glucose: 1,
};

function BinaryField({
  label,
  value,
  name,
  onChange,
  hint,
}: {
  label: string;
  value: 0 | 1;
  name: string;
  onChange: (v: 0 | 1) => void;
  hint?: string;
}) {
  return (
    <div>
      <Label className="text-sm font-medium">{label}</Label>
      {hint && <p className="text-xs text-gray-500 mt-0.5">{hint}</p>}
      <div className="mt-2 flex gap-6">
        {(['No', 'Yes'] as const).map((opt, i) => (
          <label key={opt} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name={name}
              value={i}
              checked={value === i}
              onChange={() => onChange(i as 0 | 1)}
              className="w-4 h-4"
            />
            <span className="text-sm">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export function PatientForm({ onSubmit, isLoading = false }: PatientFormProps) {
  const [form, setForm] = useState<FormState>(DEFAULTS);
  const [errors, setErrors] = useState<string[]>([]);
  const [step, setStep] = useState(0);

  function set<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors.length > 0) setErrors([]);
  }

  const steps = [
    {
      title: 'Personal Measurements',
      description: 'Age, BMI, and sleep habits',
      fields: (
        <div className="space-y-5">
          <div>
            <Label htmlFor="age" className="text-sm font-medium">
              Age <span className="text-red-500">*</span>
            </Label>
            <Input
              id="age"
              type="number"
              min={18}
              max={100}
              value={form.age}
              onChange={(e) => set('age', parseInt(e.target.value) || 18)}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              years → auto-mapped to BRFSS age category (Cat {ageToCategory(form.age)})
            </p>
          </div>

          <div>
            <Label htmlFor="bmi" className="text-sm font-medium">
              Body Mass Index (BMI) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="bmi"
              type="number"
              step="0.1"
              min={10}
              max={80}
              value={form.bmi}
              onChange={(e) => set('bmi', parseFloat(e.target.value) || 10)}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">kg/m² — optimal range 18.5–24.9 (sweet spot)</p>
          </div>

          <div>
            <Label htmlFor="sleepTime" className="text-sm font-medium">
              Average Sleep Time <span className="text-red-500">*</span>
            </Label>
            <Input
              id="sleepTime"
              type="number"
              step="0.5"
              min={1}
              max={24}
              value={form.sleepTime}
              onChange={(e) => set('sleepTime', parseFloat(e.target.value) || 1)}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">hours per night — optimal range 7–8 (sweet spot)</p>
          </div>
        </div>
      ),
    },
    {
      title: 'Lifestyle Habits',
      description: 'Smoking, alcohol, physical activity, and general health',
      fields: (
        <div className="space-y-5">
          <BinaryField
            label="Smoking"
            name="smoking"
            value={form.smoking}
            onChange={(v) => set('smoking', v)}
            hint="Have you smoked at least 100 cigarettes in your lifetime?"
          />

          <BinaryField
            label="Alcohol Drinking"
            name="alcoholDrinking"
            value={form.alcoholDrinking}
            onChange={(v) => set('alcoholDrinking', v)}
            hint="Heavy drinker: >14 drinks/week (men) or >7/week (women)"
          />

          <BinaryField
            label="Physical Activity"
            name="physicalActivity"
            value={form.physicalActivity}
            onChange={(v) => set('physicalActivity', v)}
            hint="Exercise (other than job) in the past 30 days?"
          />

          <div>
            <Label htmlFor="genHealth" className="text-sm font-medium">
              General Health <span className="text-red-500">*</span>
            </Label>
            <select
              id="genHealth"
              value={form.genHealth}
              onChange={(e) => set('genHealth', parseInt(e.target.value) as 1 | 2 | 3 | 4 | 5)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
            >
              <option value={5}>5 — Excellent</option>
              <option value={4}>4 — Very Good</option>
              <option value={3}>3 — Good</option>
              <option value={2}>2 — Fair</option>
              <option value={1}>1 — Poor</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">Self-assessment of overall health status</p>
          </div>
        </div>
      ),
    },
    {
      title: 'Physical & Mental Health',
      description: 'Recent health days and mobility status',
      fields: (
        <div className="space-y-5">
          <div>
            <Label htmlFor="physicalHealth" className="text-sm font-medium">
              Poor Physical Health Days <span className="text-red-500">*</span>
            </Label>
            <Input
              id="physicalHealth"
              type="number"
              min={0}
              max={30}
              value={form.physicalHealth}
              onChange={(e) => set('physicalHealth', parseInt(e.target.value) || 0)}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Number of days (0–30) in past month with poor physical health (illness, injury)
            </p>
          </div>

          <div>
            <Label htmlFor="mentalHealth" className="text-sm font-medium">
              Poor Mental Health Days <span className="text-red-500">*</span>
            </Label>
            <Input
              id="mentalHealth"
              type="number"
              min={0}
              max={30}
              value={form.mentalHealth}
              onChange={(e) => set('mentalHealth', parseInt(e.target.value) || 0)}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Number of days (0–30) in past month with poor mental health (stress, depression)
            </p>
          </div>

          <BinaryField
            label="Difficulty Walking / Climbing Stairs"
            name="diffWalking"
            value={form.diffWalking}
            onChange={(v) => set('diffWalking', v)}
            hint="Serious difficulty walking or climbing stairs?"
          />
        </div>
      ),
    },
    {
      title: 'Medical History',
      description: 'Past and existing conditions',
      fields: (
        <div className="space-y-5">
          <BinaryField
            label="Stroke"
            name="stroke"
            value={form.stroke}
            onChange={(v) => set('stroke', v)}
            hint="Ever had a stroke?"
          />

          <BinaryField
            label="Diabetic"
            name="diabetic"
            value={form.diabetic}
            onChange={(v) => set('diabetic', v)}
            hint="Diagnosed with diabetes?"
          />

          <BinaryField
            label="Asthma"
            name="asthma"
            value={form.asthma}
            onChange={(v) => set('asthma', v)}
            hint="Currently have asthma?"
          />

          <BinaryField
            label="Kidney Disease"
            name="kidneyDisease"
            value={form.kidneyDisease}
            onChange={(v) => set('kidneyDisease', v)}
            hint="Excluding kidney stones, diagnosed with kidney disease?"
          />

          <BinaryField
            label="Skin Cancer"
            name="skinCancer"
            value={form.skinCancer}
            onChange={(v) => set('skinCancer', v)}
            hint="Ever diagnosed with skin cancer?"
          />
        </div>
      ),
    },
    {
      title: 'Blood Measurements',
      description: 'Blood pressure, cholesterol, and glucose levels',
      fields: (
        <div className="space-y-5">
          <div>
            <Label htmlFor="systolicBP" className="text-sm font-medium">
              Systolic Blood Pressure <span className="text-red-500">*</span>
            </Label>
            <Input
              id="systolicBP"
              type="number"
              min={70}
              max={250}
              value={form.systolicBP}
              onChange={(e) => set('systolicBP', parseInt(e.target.value) || 70)}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">mmHg — optimal 90–120 (sweet spot)</p>
          </div>

          <div>
            <Label htmlFor="diastolicBP" className="text-sm font-medium">
              Diastolic Blood Pressure <span className="text-red-500">*</span>
            </Label>
            <Input
              id="diastolicBP"
              type="number"
              min={40}
              max={150}
              value={form.diastolicBP}
              onChange={(e) => set('diastolicBP', parseInt(e.target.value) || 40)}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">mmHg — optimal 60–80 (sweet spot)</p>
          </div>

          <div>
            <Label htmlFor="cholesterol" className="text-sm font-medium">
              Cholesterol Level <span className="text-red-500">*</span>
            </Label>
            <select
              id="cholesterol"
              value={form.cholesterol}
              onChange={(e) =>
                set('cholesterol', parseInt(e.target.value) as 1 | 2 | 3)
              }
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
            >
              <option value={1}>1 — Normal</option>
              <option value={2}>2 — Above Normal</option>
              <option value={3}>3 — Well Above Normal</option>
            </select>
          </div>

          <div>
            <Label htmlFor="glucose" className="text-sm font-medium">
              Glucose Level <span className="text-red-500">*</span>
            </Label>
            <select
              id="glucose"
              value={form.glucose}
              onChange={(e) =>
                set('glucose', parseInt(e.target.value) as 1 | 2 | 3)
              }
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
            >
              <option value={1}>1 — Normal</option>
              <option value={2}>2 — Above Normal</option>
              <option value={3}>3 — Well Above Normal</option>
            </select>
          </div>
        </div>
      ),
    },
  ];

  const currentStep = steps[step];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const patientData: PatientData = {
      ageCategory: ageToCategory(form.age),
      smoking: form.smoking,
      alcoholDrinking: form.alcoholDrinking,
      stroke: form.stroke,
      physicalHealth: form.physicalHealth,
      mentalHealth: form.mentalHealth,
      diffWalking: form.diffWalking,
      diabetic: form.diabetic,
      physicalActivity: form.physicalActivity,
      genHealth: form.genHealth,
      asthma: form.asthma,
      kidneyDisease: form.kidneyDisease,
      skinCancer: form.skinCancer,
      bmi: form.bmi,
      sleepTime: form.sleepTime,
      systolicBP: form.systolicBP,
      diastolicBP: form.diastolicBP,
      cholesterol: form.cholesterol,
      glucose: form.glucose,
    };

    const validationErrors = validatePatientData(patientData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit(patientData);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <Card className="border-clinical-border">
        <CardHeader className="bg-clinical-header">
          <CardTitle className="text-clinical-primary">{currentStep.title}</CardTitle>
          <CardDescription>{currentStep.description}</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {errors.length > 0 && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-800 mb-1">Validation Errors:</p>
                <ul className="text-sm text-red-700 space-y-1">
                  {errors.map((err, i) => (
                    <li key={i}>• {err}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {currentStep.fields}

          <div className="mt-8 flex gap-3">
            {step > 0 && (
              <Button type="button" variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
                Previous
              </Button>
            )}
            {step < steps.length - 1 ? (
              <Button
                type="button"
                onClick={() => setStep(step + 1)}
                className="flex-1 bg-clinical-primary hover:bg-clinical-primary/90"
              >
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-clinical-primary hover:bg-clinical-primary/90"
              >
                {isLoading ? 'Analyzing...' : 'Assess Risk'}
              </Button>
            )}
          </div>

          <div className="mt-4 flex gap-1 justify-center">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-2 w-8 rounded-full ${i === step ? 'bg-clinical-primary' : 'bg-gray-200'}`}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
