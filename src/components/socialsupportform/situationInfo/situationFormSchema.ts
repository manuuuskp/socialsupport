import * as yup from 'yup';

export const situtationFormSchema = yup.object({
    financialSituation: yup.string().required('validation.required').min(30, 'validation.minLength'),
    employmentCircumstances: yup.string().required('validation.required').min(30, 'validation.minLength'),
    reasonForApplying: yup.string().required('validation.required').min(30, 'validation.minLength'),
});