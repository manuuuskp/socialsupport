import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { FormData, StepKey } from '../types';

const initialFormData: FormData = {
    personal: {},
    family: {},
    situation: {},
    meta: {
        language: 'en',
    },
};

interface FormState {
    formData: FormData;
    currentStep: number;
}

const initialState: FormState = {
    formData: initialFormData,
    currentStep: 0,
};

const formSlice = createSlice({
    name: 'form',
    initialState,
    reducers: {
        setCurrentStep: (state, action: PayloadAction<number>) => {
            state.currentStep = action.payload;
        },
        updateStep: (state, action: PayloadAction<{ step: StepKey; data: Partial<any> }>) => {
            const { step, data } = action.payload;
            state.formData[step] = {
                ...state.formData[step],
                ...data,
            };
            state.formData.meta = {
                ...state.formData.meta,
                lastSavedAt: new Date().toISOString(),
            };
        },
    },
});

export const {
    updateStep,
    setCurrentStep,
} = formSlice.actions;
export default formSlice.reducer;