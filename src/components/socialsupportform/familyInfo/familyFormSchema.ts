import * as yup from "yup";

export const familyFormSchema = yup.object({
  maritalStatus: yup
    .string()
    .required('validation.required')
    .oneOf(["single", "married", "divorced", "widowed"], 'validation.maritalStatusInvalid'),

  dependents: yup
    .number()
    .typeError("Dependents must be a number")
    .min(0, 'validation.dependentsNumber')
    .max(20, 'validation.dependentsNumber')
    .required('validation.required'),

  employmentStatus: yup
    .string()
    .required('validation.required')
    .oneOf(["employed", "self-employed", "unemployed", "student", "retired"], 'validation.employmentStatusInvalid'),

  incomeCurrency: yup
    .string()
    .required('validation.required')
    .matches(/^[A-Z]{3}$/, 'validation.currencyFormat'),

  monthlyIncome: yup
    .number()
    .typeError('validation.incomePositive')
    .required('validation.required')
    .positive('validation.incomePositive')
    .max(10000000, 'validation.incomeMax'),

  housingStatus: yup
    .string()
    .required('validation.required')
    .oneOf(["owned", "rented", "shelter", "homeless"], 'validation.housingStatusInvalid'),
});
