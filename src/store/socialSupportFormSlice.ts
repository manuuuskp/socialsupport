import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { FormData, FormState, StepKey } from '../types/types';

export const formSliceName = 'socialSupportForm';

const initialFormData: FormData = {
  personal: {},
  family: {},
  situation: {},
  meta: { language: 'en' },
};

const initialState: FormState = {
  formData: initialFormData,
  currentStep: 0,
};

const socialSupportFormSlice = createSlice({
  name: formSliceName,
  initialState,
  reducers: {
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    updateStep: (state, action: PayloadAction<{ step: StepKey; data: Partial<any> }>) => {
      const { step, data } = action.payload;
      state.formData[step] = { ...state.formData[step], ...data };
      state.formData.meta = { ...state.formData.meta, lastSavedAt: new Date().toISOString() };
    },
    resetForm: (state) => {
      state.formData = initialFormData;
      state.currentStep = 0;
    }
  },
});

export const { setCurrentStep, updateStep, resetForm } = socialSupportFormSlice.actions;

export default socialSupportFormSlice.reducer;
