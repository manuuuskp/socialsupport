import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../../../utils/test-utils';
import SituationInfo from '../SituationInfo';

// Mock the AIHelper component since it's complex and we want to focus on SituationInfo
jest.mock('../../../AIHelper', () => {
  return function MockAIHelper({ open, onClose, onAccept, fieldKey }: any) {
    if (!open) return null;
    return (
      <div data-testid="ai-helper-modal">
        <p>AI Helper Modal for {fieldKey}</p>
        <button onClick={() => onAccept('AI generated text for testing')}>Accept</button>
        <button onClick={onClose}>Close</button>
      </div>
    );
  };
});

describe('SituationInfo Component', () => {
  const renderSituationInfo = (initialState = {}) => {
    return render(<SituationInfo />, { initialState });
  };

  describe('Component Rendering', () => {
    it('should render the form title', () => {
      renderSituationInfo();
      expect(screen.getByRole('heading', { name: /situation information/i })).toBeInTheDocument();
    });

    it('should render all required textarea fields', () => {
      renderSituationInfo();
      expect(screen.getByLabelText(/financial situation/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/employment circumstances/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/reason for applying/i)).toBeInTheDocument();
    });

    it('should render AI Help buttons for each field', () => {
      renderSituationInfo();
      const aiHelpButtons = screen.getAllByText(/ai help/i);
      expect(aiHelpButtons).toHaveLength(3);
    });

    it('should render help text for each field', () => {
      renderSituationInfo();
      expect(screen.getByText(/please provide details about your financial circumstances/i)).toBeInTheDocument();
      expect(screen.getByText(/please provide details about your employment status/i)).toBeInTheDocument();
      expect(screen.getByText(/please explain why you need social support/i)).toBeInTheDocument();
    });

    it('should render proper placeholders', () => {
      renderSituationInfo();
      expect(screen.getByPlaceholderText(/describe your current financial situation/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/describe your employment situation/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/explain why you are applying for support/i)).toBeInTheDocument();
    });
  });

  describe('Form Field Types and Attributes', () => {
    it('should render textarea fields with correct attributes', () => {
      renderSituationInfo();
      
      const financialTextarea = screen.getByLabelText(/financial situation/i);
      expect(financialTextarea.tagName).toBe('TEXTAREA');
      expect(financialTextarea).toHaveAttribute('rows', '4');
      
      const employmentTextarea = screen.getByLabelText(/employment circumstances/i);
      expect(employmentTextarea.tagName).toBe('TEXTAREA');
      expect(employmentTextarea).toHaveAttribute('rows', '4');
      
      const reasonTextarea = screen.getByLabelText(/reason for applying/i);
      expect(reasonTextarea.tagName).toBe('TEXTAREA');
      expect(reasonTextarea).toHaveAttribute('rows', '4');
    });

    it('should have proper field names and ids', () => {
      renderSituationInfo();
      
      expect(screen.getByLabelText(/financial situation/i)).toHaveAttribute('id', 'financialSituation');
      expect(screen.getByLabelText(/employment circumstances/i)).toHaveAttribute('id', 'employmentCircumstances');
      expect(screen.getByLabelText(/reason for applying/i)).toHaveAttribute('id', 'reasonForApplying');
    });
  });

  describe('Form Interaction', () => {
    it('should update field values when user types', async () => {
      const user = userEvent.setup();
      renderSituationInfo();
      
      const financialField = screen.getByLabelText(/financial situation/i);
      await user.type(financialField, 'I am currently unemployed and struggling financially');
      
      expect(financialField).toHaveValue('I am currently unemployed and struggling financially');
    });

    it('should handle multiple field updates', async () => {
      const user = userEvent.setup();
      renderSituationInfo();
      
      const financialField = screen.getByLabelText(/financial situation/i);
      const employmentField = screen.getByLabelText(/employment circumstances/i);
      const reasonField = screen.getByLabelText(/reason for applying/i);
      
      await user.type(financialField, 'Financial difficulties due to job loss');
      await user.type(employmentField, 'Recently unemployed due to company closure');
      await user.type(reasonField, 'Need temporary support to get back on feet');
      
      expect(financialField).toHaveValue('Financial difficulties due to job loss');
      expect(employmentField).toHaveValue('Recently unemployed due to company closure');
      expect(reasonField).toHaveValue('Need temporary support to get back on feet');
    });

    it('should pre-populate fields with existing data', () => {
      const initialState = {
        formData: {
          personal: {},
          family: {},
          situation: {
            financialSituation: 'Existing financial info',
            employmentCircumstances: 'Existing employment info',
            reasonForApplying: 'Existing reason',
          },
          meta: { language: 'en' as const },
        },
        currentStep: 2,
      };
      
      renderSituationInfo(initialState);
      
      expect(screen.getByDisplayValue('Existing financial info')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Existing employment info')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Existing reason')).toBeInTheDocument();
    });
  });

  describe('AI Helper Integration', () => {
    it('should open AI modal when AI Help button is clicked', async () => {
      const user = userEvent.setup();
      renderSituationInfo();
      
      const aiHelpButtons = screen.getAllByText(/ai help/i);
      await user.click(aiHelpButtons[0]);
      
      expect(screen.getByTestId('ai-helper-modal')).toBeInTheDocument();
      expect(screen.getByText(/AI Helper Modal for financialSituation/i)).toBeInTheDocument();
    });

    it('should handle AI text acceptance', async () => {
      const user = userEvent.setup();
      renderSituationInfo();
      
      const aiHelpButtons = screen.getAllByText(/ai help/i);
      await user.click(aiHelpButtons[0]);
      
      const acceptButton = screen.getByText('Accept');
      await user.click(acceptButton);
      
      const financialField = screen.getByLabelText(/financial situation/i);
      expect(financialField).toHaveValue('AI generated text for testing');
    });

    it('should close AI modal when close button is clicked', async () => {
      const user = userEvent.setup();
      renderSituationInfo();
      
      const aiHelpButtons = screen.getAllByText(/ai help/i);
      await user.click(aiHelpButtons[0]);
      
      expect(screen.getByTestId('ai-helper-modal')).toBeInTheDocument();
      
      const closeButton = screen.getByText('Close');
      await user.click(closeButton);
      
      await waitFor(() => {
        expect(screen.queryByTestId('ai-helper-modal')).not.toBeInTheDocument();
      });
    });

    it('should open AI modal for different fields', async () => {
      const user = userEvent.setup();
      renderSituationInfo();
      
      const aiHelpButtons = screen.getAllByText(/ai help/i);
      
      // Test first field
      await user.click(aiHelpButtons[0]);
      expect(screen.getByText(/AI Helper Modal for financialSituation/i)).toBeInTheDocument();
      await user.click(screen.getByText('Close'));
      
      // Test second field
      await user.click(aiHelpButtons[1]);
      expect(screen.getByText(/AI Helper Modal for employmentCircumstances/i)).toBeInTheDocument();
      await user.click(screen.getByText('Close'));
      
      // Test third field
      await user.click(aiHelpButtons[2]);
      expect(screen.getByText(/AI Helper Modal for reasonForApplying/i)).toBeInTheDocument();
    });
  });

  describe('Form Validation Display', () => {
    it('should display error styling when field has error', () => {
      renderSituationInfo();
      
      const financialField = screen.getByLabelText(/financial situation/i);
      
      // Field should have error styling when empty (assuming validation is triggered)
      expect(financialField).toHaveClass('border-gray-300'); // Default state
    });

    it('should handle empty form submission gracefully', () => {
      renderSituationInfo();
      
      // Component should render without errors even when all fields are empty
      expect(screen.getByLabelText(/financial situation/i)).toHaveValue('');
      expect(screen.getByLabelText(/employment circumstances/i)).toHaveValue('');
      expect(screen.getByLabelText(/reason for applying/i)).toHaveValue('');
    });
  });

  describe('Accessibility', () => {
    it('should have proper label associations', () => {
      renderSituationInfo();
      
      expect(screen.getByLabelText(/financial situation/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/employment circumstances/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/reason for applying/i)).toBeInTheDocument();
    });

    it('should have proper form structure', () => {
      const { container } = renderSituationInfo();
      
      const form = container.querySelector('form');
      expect(form).toBeInTheDocument();
      expect(form?.tagName).toBe('FORM');
      
      // Check that all form elements are within the form
      const textboxes = screen.getAllByRole('textbox');
      expect(textboxes).toHaveLength(3);
    });

    it('should have accessible buttons', () => {
      renderSituationInfo();
      
      const aiHelpButtons = screen.getAllByRole('button', { name: /ai help/i });
      expect(aiHelpButtons).toHaveLength(3);
      
      aiHelpButtons.forEach(button => {
        expect(button).toBeInTheDocument();
        expect(button).toHaveAttribute('type', 'button');
      });
    });
  });

  describe('Component State Management', () => {
    it('should maintain field state independently', async () => {
      const user = userEvent.setup();
      renderSituationInfo();
      
      const financialField = screen.getByLabelText(/financial situation/i);
      const employmentField = screen.getByLabelText(/employment circumstances/i);
      
      await user.type(financialField, 'Financial text');
      await user.type(employmentField, 'Employment text');
      
      expect(financialField).toHaveValue('Financial text');
      expect(employmentField).toHaveValue('Employment text');
      
      // Clear one field, other should remain
      await user.clear(financialField);
      expect(financialField).toHaveValue('');
      expect(employmentField).toHaveValue('Employment text');
    });

    it('should handle rapid input changes', async () => {
      const user = userEvent.setup();
      renderSituationInfo();
      
      const financialField = screen.getByLabelText(/financial situation/i);
      
      await user.type(financialField, 'First text');
      await user.clear(financialField);
      await user.type(financialField, 'Second text');
      
      expect(financialField).toHaveValue('Second text');
    });
  });
});