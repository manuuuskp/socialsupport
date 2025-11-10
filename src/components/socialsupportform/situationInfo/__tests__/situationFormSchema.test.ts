import { situtationFormSchema } from '../situationFormSchema';

describe('Situation Form Schema Validation', () => {
  describe('Valid complete form', () => {
    it('should validate complete form with all required fields', () => {
      const validData = {
        financialSituation: 'I am currently facing financial difficulties due to unexpected medical expenses',
        employmentCircumstances: 'I lost my job recently and have been actively searching for new employment opportunities',
        reasonForApplying: 'I need temporary financial assistance to cover basic living expenses while I find new employment',
      };

      expect(situtationFormSchema.isValidSync(validData)).toBe(true);
    });
  });

  describe('Individual field validations', () => {
    describe('Financial Situation field', () => {
      it('should require financial situation field', () => {
        const invalidData = {
          employmentCircumstances: 'Valid employment circumstances text that meets minimum length requirement',
          reasonForApplying: 'Valid reason for applying text that meets minimum length requirement',
        };

        expect(situtationFormSchema.isValidSync(invalidData)).toBe(false);
      });

      it('should reject financial situation shorter than 30 characters', () => {
        const invalidData = {
          financialSituation: 'Short text',
          employmentCircumstances: 'Valid employment circumstances text that meets minimum length requirement',
          reasonForApplying: 'Valid reason for applying text that meets minimum length requirement',
        };

        expect(situtationFormSchema.isValidSync(invalidData)).toBe(false);
      });

      it('should accept financial situation with exactly 30 characters', () => {
        const validData = {
          financialSituation: 'This text has exactly thirty c',
          employmentCircumstances: 'Valid employment circumstances text that meets minimum length requirement',
          reasonForApplying: 'Valid reason for applying text that meets minimum length requirement',
        };

        expect(situtationFormSchema.isValidSync(validData)).toBe(true);
      });

      it('should accept financial situation longer than 30 characters', () => {
        const validData = {
          financialSituation: 'This is a much longer text that definitely exceeds the thirty character minimum requirement',
          employmentCircumstances: 'Valid employment circumstances text that meets minimum length requirement',
          reasonForApplying: 'Valid reason for applying text that meets minimum length requirement',
        };

        expect(situtationFormSchema.isValidSync(validData)).toBe(true);
      });
    });

    describe('Employment Circumstances field', () => {
      it('should require employment circumstances field', () => {
        const invalidData = {
          financialSituation: 'Valid financial situation text that meets minimum length requirement',
          reasonForApplying: 'Valid reason for applying text that meets minimum length requirement',
        };

        expect(situtationFormSchema.isValidSync(invalidData)).toBe(false);
      });

      it('should reject employment circumstances shorter than 30 characters', () => {
        const invalidData = {
          financialSituation: 'Valid financial situation text that meets minimum length requirement',
          employmentCircumstances: 'Too short',
          reasonForApplying: 'Valid reason for applying text that meets minimum length requirement',
        };

        expect(situtationFormSchema.isValidSync(invalidData)).toBe(false);
      });

      it('should accept employment circumstances with minimum length', () => {
        const validData = {
          financialSituation: 'Valid financial situation text that meets minimum length requirement',
          employmentCircumstances: 'This text has exactly thirty c',
          reasonForApplying: 'Valid reason for applying text that meets minimum length requirement',
        };

        expect(situtationFormSchema.isValidSync(validData)).toBe(true);
      });
    });

    describe('Reason for Applying field', () => {
      it('should require reason for applying field', () => {
        const invalidData = {
          financialSituation: 'Valid financial situation text that meets minimum length requirement',
          employmentCircumstances: 'Valid employment circumstances text that meets minimum length requirement',
        };

        expect(situtationFormSchema.isValidSync(invalidData)).toBe(false);
      });

      it('should reject reason for applying shorter than 30 characters', () => {
        const invalidData = {
          financialSituation: 'Valid financial situation text that meets minimum length requirement',
          employmentCircumstances: 'Valid employment circumstances text that meets minimum length requirement',
          reasonForApplying: 'Short reason',
        };

        expect(situtationFormSchema.isValidSync(invalidData)).toBe(false);
      });

      it('should accept reason for applying with minimum length', () => {
        const validData = {
          financialSituation: 'Valid financial situation text that meets minimum length requirement',
          employmentCircumstances: 'Valid employment circumstances text that meets minimum length requirement',
          reasonForApplying: 'This text has exactly thirty c',
        };

        expect(situtationFormSchema.isValidSync(validData)).toBe(true);
      });
    });
  });

  describe('Multiple field validation errors', () => {
    it('should reject form with all fields missing', () => {
      const invalidData = {};

      expect(situtationFormSchema.isValidSync(invalidData)).toBe(false);
    });

    it('should reject form with all fields too short', () => {
      const invalidData = {
        financialSituation: 'Short',
        employmentCircumstances: 'Short',
        reasonForApplying: 'Short',
      };

      expect(situtationFormSchema.isValidSync(invalidData)).toBe(false);
    });

    it('should reject form with empty strings', () => {
      const invalidData = {
        financialSituation: '',
        employmentCircumstances: '',
        reasonForApplying: '',
      };

      expect(situtationFormSchema.isValidSync(invalidData)).toBe(false);
    });
  });

  describe('Edge cases', () => {
    it('should handle strings with only whitespace', () => {
      const invalidData = {
        financialSituation: '                              ', // 30 spaces
        employmentCircumstances: '                              ', // 30 spaces
        reasonForApplying: '                              ', // 30 spaces
      };

      expect(situtationFormSchema.isValidSync(invalidData)).not.toBe(true);
    });

    it('should handle strings with special characters', () => {
      const validData = {
        financialSituation: 'I have $50,000 debt & need help!',
        employmentCircumstances: 'Lost job @ company X due to COVID-19 pandemic situation affecting business',
        reasonForApplying: 'Need 100% assistance for rent & utilities until I find new employment opportunity',
      };

      expect(situtationFormSchema.isValidSync(validData)).toBe(true);
    });

    it('should handle strings with numbers and mixed content', () => {
      const validData = {
        financialSituation: 'Monthly income reduced from $3000 to $0 after layoffs in March 2024',
        employmentCircumstances: '15 years experience in tech, laid off 3 months ago, applying to 5 jobs daily',
        reasonForApplying: 'Need $1200/month for 6 months to cover rent while searching for employment',
      };

      expect(situtationFormSchema.isValidSync(validData)).toBe(true);
    });

    it('should handle very long texts', () => {
      const longText = 'This is a very long text '.repeat(10);
      
      const validData = {
        financialSituation: longText,
        employmentCircumstances: longText,
        reasonForApplying: longText,
      };

      expect(situtationFormSchema.isValidSync(validData)).toBe(true);
    });
  });

  describe('Validation error messages', () => {
    it('should return correct error messages for missing fields', async () => {
      const invalidData = {};

      try {
        await situtationFormSchema.validate(invalidData, { abortEarly: false });
      } catch (error: any) {
        const errors = error.inner;
        expect(errors).toHaveLength(3);
        expect(errors.some((err: any) => err.path === 'financialSituation')).toBe(true);
        expect(errors.some((err: any) => err.path === 'employmentCircumstances')).toBe(true);
        expect(errors.some((err: any) => err.path === 'reasonForApplying')).toBe(true);
      }
    });

    it('should return correct error messages for short fields', async () => {
      const invalidData = {
        financialSituation: 'short',
        employmentCircumstances: 'short',
        reasonForApplying: 'short',
      };

      try {
        await situtationFormSchema.validate(invalidData, { abortEarly: false });
        fail('Validation should have failed');
      } catch (error: any) {
        const errors = error.inner;
        expect(errors).toHaveLength(3);
        expect(errors.some((err: any) => err.path === 'financialSituation')).toBe(true);
        expect(errors.some((err: any) => err.path === 'employmentCircumstances')).toBe(true);
        expect(errors.some((err: any) => err.path === 'reasonForApplying')).toBe(true);
      }
    });
  });
});