import { familyFormSchema } from '../familyFormSchema';

describe('Family Form Schema Validation', () => {
  describe('Valid complete form', () => {
    it('should validate complete form with all required fields', () => {
      const validData = {
        maritalStatus: 'married',
        dependents: 2,
        employmentStatus: 'unemployed',
        incomeCurrency: 'AED',
        monthlyIncome: 5000,
        housingStatus: 'rented',
      };

      expect(familyFormSchema.isValidSync(validData)).toBe(true);
    });
  });

  describe('Dependents field validation', () => {
    it('should validate dependents as number type', () => {
      const validData = {
        maritalStatus: 'single',
        dependents: 0,
        employmentStatus: 'employed',
        incomeCurrency: 'USD',
        monthlyIncome: 3000,
        housingStatus: 'rented',
      };

      expect(familyFormSchema.isValidSync(validData)).toBe(true);
    });

    it('should reject string values for dependents', () => {
      const invalidData = {
        maritalStatus: 'single',
        dependents: 'two',
        employmentStatus: 'employed',
        incomeCurrency: 'USD',
        monthlyIncome: 3000,
        housingStatus: 'rented',
      };

      expect(familyFormSchema.isValidSync(invalidData)).toBe(false);
    });

    it('should reject negative values for dependents', () => {
      const invalidData = {
        maritalStatus: 'single',
        dependents: -1,
        employmentStatus: 'employed',
        incomeCurrency: 'USD',
        monthlyIncome: 3000,
        housingStatus: 'rented',
      };

      expect(familyFormSchema.isValidSync(invalidData)).toBe(false);
    });

    it('should accept valid range for dependents (0-20)', () => {
      const validDataMin = {
        maritalStatus: 'single',
        dependents: 0,
        employmentStatus: 'employed',
        incomeCurrency: 'USD',
        monthlyIncome: 3000,
        housingStatus: 'rented',
      };

      const validDataMax = {
        maritalStatus: 'married',
        dependents: 20,
        employmentStatus: 'employed',
        incomeCurrency: 'USD',
        monthlyIncome: 8000,
        housingStatus: 'owned',
      };

      expect(familyFormSchema.isValidSync(validDataMin)).toBe(true);
      expect(familyFormSchema.isValidSync(validDataMax)).toBe(true);
    });
  });
});