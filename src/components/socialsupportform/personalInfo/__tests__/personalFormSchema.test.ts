import { personalFormSchema } from '../personalFormSchema';

describe('Personal Form Schema Validation', () => {
  describe('Valid complete form', () => {
    it('should validate complete form with all required fields', () => {
      const validData = {
        name: 'Manoj Prabhu',
        nationalId: '123456789012345',
        dob: '1994-04-07',
        gender: 'male',
        country: 'IN',
        phoneCountryCode: '+91',
        phone: '1234567890',
        email: 'manojprabhuskp@gmail.com',
      };

      expect(() => personalFormSchema.validateSync(validData)).not.toThrow();
    });
  });

  describe('Individual field validations', () => {
    it('should validate name with letters and spaces only', () => {
      const nameSchema = personalFormSchema.pick(['name']);
      
      expect(() => nameSchema.validateSync({ name: 'Manoj123' })).toThrow();
      expect(() => nameSchema.validateSync({ name: 'M' })).toThrow();
      expect(() => nameSchema.validateSync({ name: 'Manoj Prabhu' })).not.toThrow();
    });

    it('should validate national ID format (15 digits)', () => {
      const nationalIdSchema = personalFormSchema.pick(['nationalId']);
      
      expect(() => nationalIdSchema.validateSync({ nationalId: '123' })).toThrow();
      expect(() => nationalIdSchema.validateSync({ nationalId: 'abc123' })).toThrow();
      expect(() => nationalIdSchema.validateSync({ nationalId: '123456789012345' })).not.toThrow();
    });

    it('should validate email format', () => {
      const emailSchema = personalFormSchema.pick(['email']);
      
      expect(() => emailSchema.validateSync({ email: 'invalid-email' })).toThrow();
      expect(() => emailSchema.validateSync({ email: 'manojprabhuskp@gmail.com' })).not.toThrow();
    });

    it('should validate phone number format (7-12 digits)', () => {
      const phoneSchema = personalFormSchema.pick(['phone']);
      
      expect(() => phoneSchema.validateSync({ phone: '123' })).toThrow();
      expect(() => phoneSchema.validateSync({ phone: 'abc123' })).toThrow();
      expect(() => phoneSchema.validateSync({ phone: '1234567890' })).not.toThrow();
    });
  });

  describe('Age validation', () => {
    const getDateString = (yearsAgo: number) => {
      const date = new Date();
      date.setFullYear(date.getFullYear() - yearsAgo);
      return date.toISOString().split('T')[0];
    };

    it('should validate minimum age requirement (18+)', () => {
      const dobSchema = personalFormSchema.pick(['dob']);
      const underageDateString = getDateString(17);
      const validDateString = getDateString(25);
      
      expect(() => dobSchema.validateSync({ dob: underageDateString })).toThrow();
      expect(() => dobSchema.validateSync({ dob: validDateString })).not.toThrow();
    });
  });

  describe('Optional fields', () => {
    it('should validate optional city field format when provided', () => {
      const citySchema = personalFormSchema.pick(['city']);
      
      expect(() => citySchema.validateSync({ city: 'Tamil Nadu 123' })).toThrow();
      expect(() => citySchema.validateSync({ city: 'Tamil Nadu' })).not.toThrow();
    });

    it('should validate optional address minimum length when provided', () => {
      const addressSchema = personalFormSchema.pick(['address']);
      
      expect(() => addressSchema.validateSync({ address: '123' })).toThrow();
      expect(() => addressSchema.validateSync({ address: '123 Street' })).not.toThrow();
    });

    it('should accept undefined optional fields', () => {
      const optionalSchema = personalFormSchema.pick(['city', 'address', 'state']);
      
      expect(() => optionalSchema.validateSync({})).not.toThrow();
      expect(() => optionalSchema.validateSync({ city: undefined, address: undefined })).not.toThrow();
    });
  });
});