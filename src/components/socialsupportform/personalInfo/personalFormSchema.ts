import * as yup from "yup";

export const personalFormSchema = yup.object({
  name: yup
    .string()
    .required('validation.required')
    .matches(/^[A-Za-z\s]+$/, 'validation.nameMismatch')
    .min(2, 'validation.nameLength'),

  nationalId: yup
    .number()
    .typeError('validation.nationalIdNumber')
    .required('validation.required')
    .test('length', 'validation.nationalIdFormat', (value) => {
      return value ? value.toString().length === 15 : false;
    }),

  dob: yup
    .date()
    .typeError('validation.dobInvalid')
    .required('validation.required')
    .test("is-18+", 'validation.dobAge', (value) => {
      if (!value) return false;
      const today = new Date();
      const age = today.getFullYear() - value.getFullYear();
      const hasBirthdayPassed =
        today.getMonth() > value.getMonth() ||
        (today.getMonth() === value.getMonth() && today.getDate() >= value.getDate());
      return age > 18 || (age === 18 && hasBirthdayPassed);
    }),

  gender: yup
    .string()
    .required('validation.required')
    .oneOf(["male", "female", "other"], 'validation.genderInvalid'),

  address: yup
    .string()
    .notRequired()
    .min(5, 'validation.addressLength'),

  city: yup
    .string()
    .notRequired()
    .matches(/^[A-Za-z\s]*$/, 'validation.cityCharacters'),

  state: yup
    .string()
    .notRequired()
    .matches(/^[A-Za-z\s]*$/, 'validation.stateCharacters'),

  country: yup.string().required('validation.required'),

  phoneCountryCode: yup
    .string()
    .required('validation.required')
    .matches(/^\+\d{1,4}$/, "Invalid country code"),

  phone: yup
    .number()
    .typeError('validation.phoneNumber')
    .required('validation.required')
    .test('length', 'validation.phoneDigits', (value) => {
      return value ? value.toString().length >= 7 && value.toString().length <= 12 : false;
    }),

  email: yup
    .string()
    .required('validation.required')
    .email('validation.email'),
});
