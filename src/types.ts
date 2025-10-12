export type FormData = {
  personal: {
    name?: string;
    nationalId?: string;
    dob?: string;
    gender?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    phoneCountryCode?: string;
    phone?: string;
    email?: string;
  };
  family: {
    maritalStatus?: string; // should be changed to literal types later
    dependents?: number;
    employmentStatus?: string; // should be changed to literal types later
    monthlyIncome?: number;
    housingStatus?: string; // should be changed to literal types later
  };
  situation: {
    financialSituation?: string;
    employmentCircumstances?: string;
    reasonForApplying?: string;
  };
  meta?: {
    lastSavedAt?: string;
    language?: 'en' | 'ar';
  };
}

export interface FormState {
  formData: FormData;
  currentStep: number;
}

export type StepKey = 'personal' | 'family' | 'situation';

export interface OpenAIRequest {
  fieldKey: string;
  contextText: string;
  tone?: string;
  length?: string;
}

export interface OpenAIResponse {
  data?: string;
  error?: string;
  loading: boolean;
}