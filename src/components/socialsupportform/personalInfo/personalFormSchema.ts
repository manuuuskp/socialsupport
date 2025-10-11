import * as yup from "yup";

export const personalFormSchema = yup.object({
  name: yup
    .string()
    .required('validation.required')
    .matches(/^[A-Za-z\s]+$/, 'validation.nameMismatch')
    .min(2, 'validation.nameLength'),

  nationalId: yup
    .string()
    .required('validation.required')
    .matches(/^\d{15}$/, 'validation.nationalIdFormat'),

  dob: yup
    .string()
    .required('validation.required')
    .test("is-valid-date", 'validation.dobInvalid', (value) => !isNaN(Date.parse(value!)))
    .test("is-18+", 'validation.dobAge', (value) => {
      if (!value) return false;
      const dob = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      const hasBirthdayPassed =
        today.getMonth() > dob.getMonth() ||
        (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate());
      return age > 18 || (age === 18 && hasBirthdayPassed);
    }),

  gender: yup
    .string()
    .required('validation.required')
    .oneOf(["male", "female", "other"], 'validation.genderInvalid'),

  address: yup
    .string()
    .optional()
    .min(5, 'validation.addressLength'),

  city: yup
    .string()
    .optional()
    .matches(/^[A-Za-z\s]+$/, 'validation.cityCharacters'),

  state: yup
    .string()
    .optional()
    .matches(/^[A-Za-z\s]+$/, 'validation.stateCharacters'),

  country: yup.string().required('validation.required'),

  phoneCountryCode: yup
    .string()
    .required('validation.required')
    .matches(/^\+\d{1,4}$/, "Invalid country code"),

  phone: yup
    .string()
    .required('validation.required')
    .matches(/^\d{7,12}$/, 'validation.phoneDigits'),

  email: yup
    .string()
    .required('validation.required')
    .email('validation.email'),
});
