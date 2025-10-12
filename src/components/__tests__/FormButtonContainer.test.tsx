import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormButtonContainer from '../FormButtonContainer';

const mockT = jest.fn();
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: mockT,
  }),
}));

describe('FormButtonContainer Component', () => {
  const user = userEvent.setup();
  const mockHandleSubmit = jest.fn();
  const mockHandleNext = jest.fn();
  const mockHandlePrevious = jest.fn();
  const mockIsValidStep = jest.fn();

  const defaultProps = {
    currentStep: 1,
    steps: ['step1', 'step2', 'step3'],
    isSubmitting: false,
    isValidStep: mockIsValidStep,
    handleSubmit: mockHandleSubmit,
    handleNext: mockHandleNext,
    handlePrevious: mockHandlePrevious,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockT.mockImplementation((key: string) => {
      const translations: { [key: string]: string } = {
        'buttons.previous': 'Previous',
        'buttons.back': 'Back',
        'buttons.next': 'Next',
        'buttons.submit': 'Submit',
      };
      return translations[key] || key;
    });
    mockIsValidStep.mockReturnValue(true);
  });

  describe('Component Rendering', () => {
    it('should render without crashing', () => {
      render(<FormButtonContainer {...defaultProps} />);
      expect(screen.getByRole('button', { name: /previous|back/i })).toBeInTheDocument();
    });

    it('should render previous button', () => {
      render(<FormButtonContainer {...defaultProps} />);
      
      const previousButton = screen.getByRole('button', { name: /previous|back/i });
      expect(previousButton).toBeInTheDocument();
      expect(previousButton.tagName).toBe('BUTTON');
    });

    it('should render next button when not on last step', () => {
      render(<FormButtonContainer {...defaultProps} />);
      
      const nextButton = screen.getByRole('button', { name: 'Next' });
      expect(nextButton).toBeInTheDocument();
    });

    it('should render submit button when on last step', () => {
      const lastStepProps = { ...defaultProps, currentStep: 2 };
      render(<FormButtonContainer {...lastStepProps} />);
      
      const submitButton = screen.getByRole('button', { name: 'Submit' });
      expect(submitButton).toBeInTheDocument();
    });
  });

  describe('Button States', () => {
    it('should hide previous button on first step', () => {
      const firstStepProps = { ...defaultProps, currentStep: 0 };
      render(<FormButtonContainer {...firstStepProps} />);
      
      const previousButton = screen.getByRole('button', { name: /previous|back/i });
      expect(previousButton).toBeDisabled();
    });

    it('should disable next button when step is invalid', () => {
      mockIsValidStep.mockReturnValue(false);
      render(<FormButtonContainer {...defaultProps} />);
      
      const nextButton = screen.getByRole('button', { name: 'Next' });
      expect(nextButton).toBeDisabled();
    });

    it('should enable next button when step is valid', () => {
      mockIsValidStep.mockReturnValue(true);
      render(<FormButtonContainer {...defaultProps} />);
      
      const nextButton = screen.getByRole('button', { name: 'Next' });
      expect(nextButton).not.toBeDisabled();
    });

    it('should disable submit button when step is invalid', () => {
      mockIsValidStep.mockReturnValue(false);
      const lastStepProps = { ...defaultProps, currentStep: 2 };
      render(<FormButtonContainer {...lastStepProps} />);
      
      const submitButton = screen.getByRole('button', { name: 'Submit' });
      expect(submitButton).toBeDisabled();
    });

    it('should disable submit button when submitting', () => {
      const submittingProps = { ...defaultProps, currentStep: 2, isSubmitting: true };
      render(<FormButtonContainer {...submittingProps} />);
      
      const submitButton = screen.getByRole('button', { name: 'Submit' });
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Button Click Handlers', () => {
    it('should call handlePrevious when previous button is clicked', async () => {
      render(<FormButtonContainer {...defaultProps} />);
      
      const previousButton = screen.getByRole('button', { name: /previous|back/i });
      await user.click(previousButton);
      
      expect(mockHandlePrevious).toHaveBeenCalledTimes(1);
    });

    it('should call handleNext when next button is clicked', async () => {
      render(<FormButtonContainer {...defaultProps} />);
      
      const nextButton = screen.getByRole('button', { name: 'Next' });
      await user.click(nextButton);
      
      expect(mockHandleNext).toHaveBeenCalledTimes(1);
    });

    it('should call handleSubmit when submit button is clicked', async () => {
      const lastStepProps = { ...defaultProps, currentStep: 2 };
      render(<FormButtonContainer {...lastStepProps} />);
      
      const submitButton = screen.getByRole('button', { name: 'Submit' });
      await user.click(submitButton);
      
      expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
    });

    it('should not call handlePrevious when button is disabled', async () => {
      const firstStepProps = { ...defaultProps, currentStep: 0 };
      render(<FormButtonContainer {...firstStepProps} />);
      
      const previousButton = screen.getByRole('button', { name: /previous|back/i });
      await user.click(previousButton);
      
      expect(mockHandlePrevious).not.toHaveBeenCalled();
    });

    it('should not call handleNext when button is disabled', async () => {
      mockIsValidStep.mockReturnValue(false);
      render(<FormButtonContainer {...defaultProps} />);
      
      const nextButton = screen.getByRole('button', { name: 'Next' });
      await user.click(nextButton);
      
      expect(mockHandleNext).not.toHaveBeenCalled();
    });
  });

  describe('Step Validation', () => {
    it('should call isValidStep with current step', () => {
      render(<FormButtonContainer {...defaultProps} />);
      
      expect(mockIsValidStep).toHaveBeenCalledWith(defaultProps.currentStep);
    });

    it('should call isValidStep for different steps', () => {
      const step2Props = { ...defaultProps, currentStep: 2 };
      render(<FormButtonContainer {...step2Props} />);
      
      expect(mockIsValidStep).toHaveBeenCalledWith(2);
    });
  });

  describe('Responsive Text', () => {
    it('should show "Previous" text for desktop', () => {
      render(<FormButtonContainer {...defaultProps} />);
      
      expect(screen.getByText('Previous')).toBeInTheDocument();
    });

    it('should show "Back" text for mobile', () => {
      render(<FormButtonContainer {...defaultProps} />);
      
      expect(screen.getByText('Back')).toBeInTheDocument();
    });
  });

  describe('Translation Integration', () => {
    it('should translate button texts', () => {
      render(<FormButtonContainer {...defaultProps} />);
      
      expect(mockT).toHaveBeenCalledWith('buttons.previous');
      expect(mockT).toHaveBeenCalledWith('buttons.back');
      expect(mockT).toHaveBeenCalledWith('buttons.next');
    });

    it('should translate submit button text on last step', () => {
      const lastStepProps = { ...defaultProps, currentStep: 2 };
      render(<FormButtonContainer {...lastStepProps} />);
      
      expect(mockT).toHaveBeenCalledWith('buttons.submit');
    });
  });

  describe('Different Step Configurations', () => {
    it('should handle single step form', () => {
      const singleStepProps = {
        ...defaultProps,
        currentStep: 0,
        steps: ['onlyStep'],
      };
      render(<FormButtonContainer {...singleStepProps} />);
      
      expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /previous|back/i })).toBeDisabled();
    });

    it('should handle middle step correctly', () => {
      const middleStepProps = {
        ...defaultProps,
        currentStep: 1,
        steps: ['step1', 'step2', 'step3'],
      };
      render(<FormButtonContainer {...middleStepProps} />);
      
      expect(screen.getByRole('button', { name: /previous|back/i })).not.toBeDisabled();
      expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Submit' })).not.toBeInTheDocument();
    });
  });
});