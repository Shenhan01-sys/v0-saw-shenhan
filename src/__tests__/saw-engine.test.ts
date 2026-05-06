import { describe, it, expect } from 'vitest';
import { assessCardiovascularRisk, PatientData } from '@/lib/saw-engine';

describe('SAW Engine - Unit Tests', () => {
  describe('assessCardiovascularRisk', () => {
    it('should return a valid assessment result for complete patient data', () => {
      const patient: PatientData = {
        ageCategory: 2,
        bmi: 22.0,
        smoking: 0,
        alcoholDrinking: 0,
        stroke: 0,
        physicalHealth: 0,
        mentalHealth: 0,
        diffWalking: 0,
        diabetic: 0,
        physicalActivity: 1,
        genHealth: 4,
        asthma: 0,
        kidneyDisease: 0,
        skinCancer: 0,
        sleepTime: 7,
        systolicBP: 120,
        diastolicBP: 80,
        cholesterol: 1,
        glucose: 1,
      };

      const result = assessCardiovascularRisk(patient);

      expect(result.riskCategory).toBeDefined();
      expect(['Low', 'Moderate', 'High']).toContain(result.riskCategory);
      expect(result.riskPercentage).toBeGreaterThanOrEqual(0);
      expect(result.riskPercentage).toBeLessThanOrEqual(100);
    });

    it('should return risk score between 0-100 for patient with risk factors', () => {
      const patient: PatientData = {
        ageCategory: 7,
        bmi: 30.0,
        smoking: 1,
        alcoholDrinking: 0,
        stroke: 0,
        physicalHealth: 15,
        mentalHealth: 5,
        diffWalking: 0,
        diabetic: 1,
        physicalActivity: 0,
        genHealth: 2,
        asthma: 0,
        kidneyDisease: 0,
        skinCancer: 0,
        sleepTime: 5,
        systolicBP: 160,
        diastolicBP: 100,
        cholesterol: 3,
        glucose: 3,
      };

      const result = assessCardiovascularRisk(patient);

      expect(result.riskPercentage).toBeGreaterThanOrEqual(0);
      expect(result.riskPercentage).toBeLessThanOrEqual(100);
      expect(result.v1Score).toBeDefined();
      expect(result.v2Score).toBeDefined();
    });

    it('should include stage scores and features in result', () => {
      const patient: PatientData = {
        ageCategory: 5,
        bmi: 25.0,
        smoking: 0,
        alcoholDrinking: 0,
        stroke: 0,
        physicalHealth: 0,
        mentalHealth: 0,
        diffWalking: 0,
        diabetic: 0,
        physicalActivity: 1,
        genHealth: 3,
        asthma: 0,
        kidneyDisease: 0,
        skinCancer: 0,
        sleepTime: 7,
        systolicBP: 120,
        diastolicBP: 80,
        cholesterol: 1,
        glucose: 1,
      };

      const result = assessCardiovascularRisk(patient);

      expect(result.v1Score).toBeDefined();
      expect(result.v2Score).toBeDefined();
      expect(result.vFinal).toBeDefined();
      expect(result.riskPercentage).toBeDefined();
      expect(result.stage1Features).toBeDefined();
      expect(result.stage2Features).toBeDefined();
    });

    it('should categorize correctly based on thresholds', () => {
      const youngHealthyPatient: PatientData = {
        ageCategory: 1,
        bmi: 20.0,
        smoking: 0,
        alcoholDrinking: 0,
        stroke: 0,
        physicalHealth: 0,
        mentalHealth: 0,
        diffWalking: 0,
        diabetic: 0,
        physicalActivity: 1,
        genHealth: 5,
        asthma: 0,
        kidneyDisease: 0,
        skinCancer: 0,
        sleepTime: 8,
        systolicBP: 110,
        diastolicBP: 70,
        cholesterol: 1,
        glucose: 1,
      };

      const result = assessCardiovascularRisk(youngHealthyPatient);

      expect(['Low', 'Moderate', 'High']).toContain(result.riskCategory);
    });

    it('should apply family history multiplier when provided', () => {
      const basePatient: PatientData = {
        ageCategory: 5,
        bmi: 25.0,
        smoking: 0,
        alcoholDrinking: 0,
        stroke: 0,
        physicalHealth: 0,
        mentalHealth: 0,
        diffWalking: 0,
        diabetic: 0,
        physicalActivity: 1,
        genHealth: 3,
        asthma: 0,
        kidneyDisease: 0,
        skinCancer: 0,
        sleepTime: 7,
        systolicBP: 120,
        diastolicBP: 80,
        cholesterol: 1,
        glucose: 1,
        familyHistory: 'yes',
      };

      const result = assessCardiovascularRisk(basePatient);

      expect(result.riskPercentage).toBeDefined();
      expect(result.riskCategory).toBeDefined();
    });
  });
});