import React from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import type { ReactElement } from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import socialSupportFormSlice from '../store/socialSupportFormSlice';

i18n.init({
  lng: 'en',
  fallbackLng: 'en',
  resources: {
    en: {
      translation: {
        'form.step1.title': 'Personal Information',
        'form.step1.name.label': 'Full Name',
        'form.step1.name.placeholder': 'Enter your full name',
        'form.step1.nationalId.label': 'National ID',
        'form.step1.nationalId.placeholder': 'Enter your national ID',
        'form.step1.dob.label': 'Date of Birth',
        'form.step1.gender.label': 'Gender',
        'form.step1.gender.placeholder': 'Select your gender',
        'form.step1.gender.options.male': 'Male',
        'form.step1.gender.options.female': 'Female',
        'form.step1.gender.options.other': 'Other',
        'form.step1.address.label': 'Address',
        'form.step1.address.placeholder': 'Enter your address',
        'form.step1.city.label': 'City',
        'form.step1.city.placeholder': 'Enter your city',
        'form.step1.state.label': 'State',
        'form.step1.state.placeholder': 'Enter your state',
        'form.step1.country.label': 'Country',
        'form.step1.country.placeholder': 'Select your country',
        'form.step1.phone.label': 'Phone Number',
        'form.step1.email.label': 'Email',
        'form.step1.email.placeholder': 'Enter your email',
        'validation.required': 'This field is required',
        'validation.nameMismatch': 'Name can only contain letters and spaces',
        'validation.nameLength': 'Name must be at least 2 characters',
        'validation.nationalIdFormat': 'National ID must be 15 digits',
        'validation.dobInvalid': 'Please enter a valid date',
        'validation.dobAge': 'Must be 18 years or older',
        'validation.genderInvalid': 'Please select a valid gender',
        'validation.addressLength': 'Address must be at least 5 characters',
        'validation.cityCharacters': 'City can only contain letters and spaces',
        'validation.stateCharacters': 'State can only contain letters and spaces',
        'validation.phoneDigits': 'Phone number must be 7-12 digits',
        'validation.email': 'Please enter a valid email address',
        'validation.minLength': 'Must be at least 15 characters',
        'form.step3.title': 'Situation Information',
        'form.step3.financialSituation.label': 'Financial Situation',
        'form.step3.financialSituation.placeholder': 'Describe your current financial situation',
        'form.step3.financialSituation.helpText': 'Please provide details about your financial circumstances',
        'form.step3.employmentCircumstances.label': 'Employment Circumstances',
        'form.step3.employmentCircumstances.placeholder': 'Describe your employment situation',
        'form.step3.employmentCircumstances.helpText': 'Please provide details about your employment status',
        'form.step3.reasonForApplying.label': 'Reason for Applying',
        'form.step3.reasonForApplying.placeholder': 'Explain why you are applying for support',
        'form.step3.reasonForApplying.helpText': 'Please explain why you need social support',
        'buttons.aiHelper': 'Help Me Write',
      },
    },
  },
});

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      socialSupportForm: socialSupportFormSlice,
    },
    preloadedState: {
      socialSupportForm: {
        formData: {
          personal: {},
          family: {},
          situation: {},
          meta: { language: 'en' as 'en' | 'ar' },
        },
        currentStep: 0,
        isDirty: false,
        ...initialState,
      },
    },
  });
};

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialState?: any;
}

const customRender = (
  ui: ReactElement,
  {
    initialState = {},
    ...renderOptions
  }: CustomRenderOptions = {}
) => {
  const store = createMockStore(initialState);

  function Wrapper({ children }: { children?: React.ReactNode }) {
    return (
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          {children}
        </I18nextProvider>
      </Provider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

export * from '@testing-library/react';
export { customRender as render };
export { createMockStore };