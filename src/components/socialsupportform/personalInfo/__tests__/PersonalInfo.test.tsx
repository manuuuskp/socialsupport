import { screen } from '@testing-library/react';
import { render } from '../../../../utils/test-utils';
import PersonalInfo from '../PersonalInfo';

jest.mock('../../../../utils/constants/constants', () => ({
  COUNTRIES: [
    { value: 'IN', label: 'India' },
    { value: 'AE', label: 'United Arab Emirates' },
  ],
  COUNTRY_CODES: [
    { value: '+91', label: '+91 (IN)' },
    { value: '+971', label: '+971 (UAE)' },
  ],
}));

describe('PersonalInfo Component', () => {
  beforeEach(() => {
    render(<PersonalInfo />);
  });

  describe('Component Rendering', () => {
    it('should render the form title', () => {
      expect(screen.getByText('Personal Information')).toBeInTheDocument();
    });

    it('should render all required input fields', () => {
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/national id/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/date of birth/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    });

    it('should render select fields', () => {
      expect(screen.getByLabelText(/gender/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/country/i)).toBeInTheDocument();
    });

    it('should render optional fields', () => {
      expect(screen.getByLabelText(/address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/state/i)).toBeInTheDocument();
    });

    it('should render phone field components', () => {
      expect(screen.getByText(/phone number/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/phone number/i)).toBeInTheDocument();
      expect(screen.getByText(/code/i)).toBeInTheDocument();
    });
  });

  describe('Form Field Types', () => {
    it('should render name input as text field', () => {
      const nameInput = screen.getByLabelText(/full name/i);
      expect(nameInput).toHaveAttribute('type', 'text');
    });

    it('should render national ID as number field', () => {
      const nationalIdInput = screen.getByLabelText(/national id/i);
      expect(nationalIdInput).toHaveAttribute('type', 'number');
    });

    it('should render date of birth as date field', () => {
      const dobInput = screen.getByLabelText(/date of birth/i);
      expect(dobInput).toHaveAttribute('type', 'date');
    });

    it('should render phone number as number field', () => {
      const phoneInput = screen.getByPlaceholderText(/phone number/i);
      expect(phoneInput).toHaveAttribute('type', 'number');
    });

    it('should render email as email field', () => {
      const emailInput = screen.getByLabelText(/email/i);
      expect(emailInput).toHaveAttribute('type', 'email');
    });
  });

  describe('Form Field Placeholders', () => {
    it('should have proper placeholders for input fields', () => {
      expect(screen.getByPlaceholderText(/enter your full name/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/enter your national id/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
    });
  });

  describe('Select Field Options', () => {
    it('should render gender options', () => {
      const genderSelect = screen.getByLabelText(/gender/i);
      expect(genderSelect).toBeInTheDocument();
      
      expect(genderSelect.tagName).toBe('SELECT');
    });

    it('should render country options', () => {
      const countrySelect = screen.getByLabelText(/country/i);
      expect(countrySelect).toBeInTheDocument();
      expect(countrySelect.tagName).toBe('SELECT');
    });
  });
});