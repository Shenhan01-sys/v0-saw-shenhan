'use client';

import React, { useState } from 'react';
import { PatientData, validatePatientData } from '@/lib/saw-engine';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';

interface PatientFormProps {
  onSubmit: (data: PatientData) => void;
  isLoading?: boolean;
}

export function PatientForm({ onSubmit, isLoading = false }: PatientFormProps) {
  const [formData, setFormData] = useState<Partial<PatientData>>({
    age: 45,
    gender: 'M',
    restingBP: 120,
    maxHR: 150,
    fastingBS: 100,
    chol: 200,
    oldpeak: 0,
    slope: 2,
    bmi: 24,
    sleepTime: 7,
    physicalActivity: 3,
    diabetic: 0,
    smoking: 0,
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  const handleInputChange = (field: keyof PatientData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: typeof value === 'string' ? parseFloat(value) || value : value,
    }));
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validatePatientData(formData);

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Type assertion - we've validated the data
    onSubmit(formData as PatientData);
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const formSteps = [
    {
      title: 'Demographic & Age',
      description: 'Basic patient information',
      fields: (
        <div className="space-y-4">
          <div>
            <Label htmlFor="age" className="text-sm font-medium">
              Age <span className="text-red-500">*</span>
            </Label>
            <Input
              id="age"
              type="number"
              min={18}
              max={120}
              value={formData.age || ''}
              onChange={(e) => handleInputChange('age', e.target.value)}
              placeholder="45"
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">years (Cost criterion - older increases risk)</p>
          </div>

          <div>
            <Label htmlFor="gender" className="text-sm font-medium">
              Gender <span className="text-red-500">*</span>
            </Label>
            <div className="mt-2 flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="M"
                  checked={formData.gender === 'M'}
                  onChange={(e) => handleInputChange('gender', e.target.value as 'M' | 'F')}
                  className="w-4 h-4"
                />
                <span className="text-sm">Male</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="F"
                  checked={formData.gender === 'F'}
                  onChange={(e) => handleInputChange('gender', e.target.value as 'M' | 'F')}
                  className="w-4 h-4"
                />
                <span className="text-sm">Female</span>
              </label>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Blood Pressure & Heart Rate',
      description: 'Cardiovascular measurements',
      fields: (
        <div className="space-y-4">
          <div>
            <Label htmlFor="restingBP" className="text-sm font-medium">
              Resting Blood Pressure <span className="text-red-500">*</span>
            </Label>
            <Input
              id="restingBP"
              type="number"
              min={50}
              max={250}
              value={formData.restingBP || ''}
              onChange={(e) => handleInputChange('restingBP', e.target.value)}
              placeholder="120"
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">mmHg (Cost criterion - lower is better)</p>
          </div>

          <div>
            <Label htmlFor="maxHR" className="text-sm font-medium">
              Maximum Heart Rate Achieved <span className="text-red-500">*</span>
            </Label>
            <Input
              id="maxHR"
              type="number"
              min={30}
              max={250}
              value={formData.maxHR || ''}
              onChange={(e) => handleInputChange('maxHR', e.target.value)}
              placeholder="150"
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">bpm (Benefit criterion - higher is better)</p>
          </div>
        </div>
      ),
    },
    {
      title: 'Blood Chemistry',
      description: 'Cholesterol and glucose levels',
      fields: (
        <div className="space-y-4">
          <div>
            <Label htmlFor="chol" className="text-sm font-medium">
              Cholesterol <span className="text-red-500">*</span>
            </Label>
            <Input
              id="chol"
              type="number"
              min={100}
              max={600}
              value={formData.chol || ''}
              onChange={(e) => handleInputChange('chol', e.target.value)}
              placeholder="200"
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">mg/dl (Cost criterion - lower is better)</p>
          </div>

          <div>
            <Label htmlFor="fastingBS" className="text-sm font-medium">
              Fasting Blood Sugar <span className="text-red-500">*</span>
            </Label>
            <Input
              id="fastingBS"
              type="number"
              min={40}
              max={300}
              value={formData.fastingBS || ''}
              onChange={(e) => handleInputChange('fastingBS', e.target.value)}
              placeholder="100"
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">mg/dl (Cost criterion - lower is better)</p>
          </div>

          <div>
            <Label htmlFor="oldpeak" className="text-sm font-medium">
              ST Depression (Oldpeak)
            </Label>
            <Input
              id="oldpeak"
              type="number"
              step="0.1"
              min={0}
              max={10}
              value={formData.oldpeak || ''}
              onChange={(e) => handleInputChange('oldpeak', e.target.value)}
              placeholder="0"
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">mm (Cost criterion - lower is better)</p>
          </div>
        </div>
      ),
    },
    {
      title: 'Physical Metrics & Lifestyle',
      description: 'BMI, sleep, and activity levels',
      fields: (
        <div className="space-y-4">
          <div>
            <Label htmlFor="bmi" className="text-sm font-medium">
              Body Mass Index (BMI) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="bmi"
              type="number"
              step="0.1"
              min={10}
              max={60}
              value={formData.bmi || ''}
              onChange={(e) => handleInputChange('bmi', e.target.value)}
              placeholder="24"
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">kg/m² (Sweet Spot [18.5-24.9] - optimal in range)</p>
          </div>

          <div>
            <Label htmlFor="sleepTime" className="text-sm font-medium">
              Sleep Time
            </Label>
            <Input
              id="sleepTime"
              type="number"
              step="0.5"
              min={2}
              max={15}
              value={formData.sleepTime || ''}
              onChange={(e) => handleInputChange('sleepTime', e.target.value)}
              placeholder="7"
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">hours (Sweet Spot [7-8h] - optimal in range)</p>
          </div>

          <div>
            <Label htmlFor="physicalActivity" className="text-sm font-medium">
              Physical Activity
            </Label>
            <Input
              id="physicalActivity"
              type="number"
              min={0}
              max={7}
              value={formData.physicalActivity || ''}
              onChange={(e) => handleInputChange('physicalActivity', e.target.value)}
              placeholder="3"
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">days per week (Benefit criterion - higher is better)</p>
          </div>
        </div>
      ),
    },
    {
      title: 'Medical History',
      description: 'Chronic conditions and lifestyle habits',
      fields: (
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Diabetic Status</Label>
            <div className="mt-2 flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="diabetic"
                  value="0"
                  checked={formData.diabetic === 0}
                  onChange={(e) => handleInputChange('diabetic', parseInt(e.target.value) as 0 | 1)}
                  className="w-4 h-4"
                />
                <span className="text-sm">No</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="diabetic"
                  value="1"
                  checked={formData.diabetic === 1}
                  onChange={(e) => handleInputChange('diabetic', parseInt(e.target.value) as 0 | 1)}
                  className="w-4 h-4"
                />
                <span className="text-sm">Yes</span>
              </label>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium">Smoking Status</Label>
            <div className="mt-2 flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="smoking"
                  value="0"
                  checked={formData.smoking === 0}
                  onChange={(e) => handleInputChange('smoking', parseInt(e.target.value) as 0 | 1)}
                  className="w-4 h-4"
                />
                <span className="text-sm">No</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="smoking"
                  value="1"
                  checked={formData.smoking === 1}
                  onChange={(e) => handleInputChange('smoking', parseInt(e.target.value) as 0 | 1)}
                  className="w-4 h-4"
                />
                <span className="text-sm">Yes</span>
              </label>
            </div>
          </div>

          <div>
            <Label htmlFor="slope" className="text-sm font-medium">
              ST Segment Slope
            </Label>
            <select
              id="slope"
              value={formData.slope || 2}
              onChange={(e) => handleInputChange('slope', parseInt(e.target.value))}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
            >
              <option value={1}>1 - Upsloping (Best)</option>
              <option value={2}>2 - Flat (Moderate)</option>
              <option value={3}>3 - Downsloping (Worst)</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">ST segment slope on ECG (Benefit criterion)</p>
          </div>
        </div>
      ),
    },
  ];

  const currentFormStep = formSteps[currentStep];

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <Card className="border-clinical-border">
        <CardHeader className="bg-clinical-header">
          <CardTitle className="text-clinical-primary">{currentFormStep.title}</CardTitle>
          <CardDescription>{currentFormStep.description}</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {errors.length > 0 && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-800 mb-1">Validation Errors:</p>
                <ul className="text-sm text-red-700 space-y-1">
                  {errors.map((error, idx) => (
                    <li key={idx}>• {error}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {currentFormStep.fields}

          <div className="mt-8 flex gap-3">
            {currentStep > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                className="flex-1"
              >
                Previous
              </Button>
            )}
            {currentStep < formSteps.length - 1 ? (
              <Button
                type="button"
                onClick={nextStep}
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
            {formSteps.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 w-8 rounded-full ${
                  idx === currentStep ? 'bg-clinical-primary' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
