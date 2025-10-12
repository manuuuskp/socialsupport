import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { I18nextProvider } from 'react-i18next';
import FamilyInfo from '../FamilyInfo';
import socialSupportFormReducer from '../../../../store/socialSupportFormSlice';
import i18n from '../../../../i18n';

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      socialSupportForm: socialSupportFormReducer,
    },
    preloadedState: {
      socialSupportForm: {
        formData: {
          personal: {},
          family: {},
          situation: {},
          meta: { language: 'en' as const },
        },
        currentStep: 1,
        ...initialState,
      },
    },
  });
};

const renderFamilyInfo = (store = createMockStore()) => {
  return render(
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <FamilyInfo />
      </I18nextProvider>
    </Provider>
  );
};

describe('FamilyInfo Component', () => {
  describe('Form Field Types', () => {
    it('should render dependents as number field', () => {
      renderFamilyInfo();
      const dependentsInput = screen.getByLabelText(/dependents/i);
      expect(dependentsInput).toHaveAttribute('type', 'number');
    });

    it('should render dependents field with correct attributes', () => {
      renderFamilyInfo();
      const dependentsInput = screen.getByLabelText(/dependents/i);
      expect(dependentsInput).toHaveAttribute('min', '0');
      expect(dependentsInput).toHaveAttribute('step', '1');
    });
  });

  describe('Component Rendering', () => {
    it('should render the form title', () => {
      renderFamilyInfo();
      expect(screen.getByText(/family information/i)).toBeInTheDocument();
    });

    it('should render all required fields', () => {
      renderFamilyInfo();
      expect(screen.getByLabelText(/marital status/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/dependents/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/employment status/i)).toBeInTheDocument();
      expect(screen.getByText(/monthly income/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/housing status/i)).toBeInTheDocument();
    });
  });
});