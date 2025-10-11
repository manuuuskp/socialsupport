import React from 'react';
import { useForm, Controller  } from 'react-hook-form';
import type { Control, FieldErrors, FieldValues } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { updateStep } from '../../store/socialSupportFormSlice';

const schema = yup.object({
  name: yup.string().required('validation.required'),
  nationalId: yup.string().required('validation.required'),
  dob: yup.string().required('validation.required'),
  gender: yup.string().required('validation.required'),
  address: yup.string().required('validation.required'),
  city: yup.string().required('validation.required'),
  state: yup.string().required('validation.required'),
  country: yup.string().required('validation.required'),
  phoneCountryCode: yup.string().required('validation.required'),
  phone: yup.string().required('validation.required'),
  email: yup.string().email('validation.email').required('validation.required'),
});

type PersonalFormData = yup.InferType<typeof schema>;

// Countries list with UAE first
const COUNTRIES = [
  { value: 'AE', label: 'United Arab Emirates' },
  { value: 'US', label: 'United States' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'CA', label: 'Canada' },
  { value: 'AU', label: 'Australia' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'IN', label: 'India' },
  { value: 'SA', label: 'Saudi Arabia' },
  { value: 'SG', label: 'Singapore' },
];

// Country codes with UAE first
const COUNTRY_CODES = [
  { value: '+971', label: '+971 (UAE)', country: 'AE' },
  { value: '+1', label: '+1 (US/CA)', country: 'US' },
  { value: '+44', label: '+44 (UK)', country: 'GB' },
  { value: '+61', label: '+61 (AU)', country: 'AU' },
  { value: '+49', label: '+49 (DE)', country: 'DE' },
  { value: '+33', label: '+33 (FR)', country: 'FR' },
  { value: '+91', label: '+91 (IN)', country: 'IN' },
  { value: '+966', label: '+966 (SA)', country: 'SA' },
  { value: '+65', label: '+65 (SG)', country: 'SG' },
  { value: '+86', label: '+86 (CN)', country: 'CN' },
];

// Move components outside to prevent recreation on each render
const InputField = ({ 
  name, 
  type = 'text', 
  placeholder, 
  label, 
  error, 
  helperText,
  control
}: {
  name: keyof PersonalFormData;
  type?: string;
  placeholder: string;
  label: string;
  error?: boolean;
  helperText?: string;
  control: Control<PersonalFormData, any, FieldValues>;
}) => (
  <div className="field-container">
    <label htmlFor={name} className="field-label">
      {label}
    </label>
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <input
          {...field}
          value={field.value || ''}
          id={name}
          type={type}
          placeholder={placeholder}
          className={error ? 'input-error' : 'input-default'}
          aria-describedby={error ? `${name}-error` : undefined}
        />
      )}
    />
    {error && helperText && (
      <p id={`${name}-error`} className="field-error">
        {helperText}
      </p>
    )}
  </div>
);

const SelectField = ({ 
  name, 
  placeholder, 
  label, 
  options, 
  error, 
  helperText,
  control
}: {
  name: keyof PersonalFormData;
  placeholder: string;
  label: string;
  options: { value: string; label: string }[];
  error?: boolean;
  helperText?: string;
  control: Control<PersonalFormData, any, FieldValues>;
}) => (
  <div className="field-container">
    <label htmlFor={name} className="field-label">
      {label}
    </label>
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <select
          {...field}
          value={field.value || ''}
          id={name}
          className={error ? 'select-error' : 'select-default'}
          aria-describedby={error ? `${name}-error` : undefined}
        >
          <option value="">{placeholder}</option>
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    />
    {error && helperText && (
      <p id={`${name}-error`} className="field-error">
        {helperText}
      </p>
    )}
  </div>
);

const TextAreaField = ({ 
  name, 
  placeholder, 
  label, 
  rows = 2,
  control
}: {
  name: keyof PersonalFormData;
  placeholder: string;
  label: string;
  rows?: number;
  control: Control<PersonalFormData, any, FieldValues>;
}) => (
  <div className="field-container">
    <label htmlFor={name} className="field-label">
      {label}
    </label>
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <textarea
          {...field}
          value={field.value || ''}
          id={name}
          rows={rows}
          placeholder={placeholder}
          className="textarea-default"
        />
      )}
    />
  </div>
);

const PhoneField = ({ 
  countryCodeName,
  phoneName,
  label, 
  error, 
  helperText,
  control
}: {
  countryCodeName: keyof PersonalFormData;
  phoneName: keyof PersonalFormData;
  label: string;
  error?: boolean;
  helperText?: string;
  control: Control<PersonalFormData, any, FieldValues>;
}) => (
  <div className="field-container">
    <label className="field-label">{label}</label>
    <div className="flex gap-2">
      <Controller
        name={countryCodeName}
        control={control}
        render={({ field }) => (
          <select
            {...field}
            value={field.value || ''}
            className={error ? 'select-error w-32' : 'select-default w-32'}
          >
            <option value="">Code</option>
            {COUNTRY_CODES.map(code => (
              <option key={code.value} value={code.value}>
                {code.label}
              </option>
            ))}
          </select>
        )}
      />
      <Controller
        name={phoneName}
        control={control}
        render={({ field }) => (
          <input
            {...field}
            value={field.value || ''}
            type="tel"
            placeholder="Phone number"
            className={error ? 'input-error flex-1' : 'input-default flex-1'}
          />
        )}
      />
    </div>
    {error && helperText && (
      <p className="field-error">{helperText}</p>
    )}
  </div>
);

const PersonalInfo = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const formData = useAppSelector((state) => state.form.formData);

  const {
    control,
    watch,
    formState: { errors },
  } = useForm<PersonalFormData>({
    resolver: yupResolver(schema),
    defaultValues: formData.personal,
    mode: 'onChange',
  });

  // Watch for changes and auto-save
  React.useEffect(() => {
    const subscription = watch((value) => {
      dispatch(updateStep({ step: 'personal', data: value }));
    });
    return () => subscription.unsubscribe();
  }, [watch, dispatch]);

  return (
    <div className="page-container">
      <h1 className="page-title">
        {t('form.step1.title')}
      </h1>

      <form className="form-section">
        <div className="form-grid-2">
          <InputField
            name="name"
            label={t('form.step1.name.label')}
            placeholder={t('form.step1.name.placeholder')}
            error={!!errors.name}
            helperText={errors.name ? t(errors.name.message as string) : ''}
            control={control}
          />
          
          <InputField
            name="nationalId"
            label={t('form.step1.nationalId.label')}
            placeholder={t('form.step1.nationalId.placeholder')}
            error={!!errors.nationalId}
            helperText={errors.nationalId ? t(errors.nationalId.message as string) : ''}
            control={control}
          />
        </div>

        <div className="form-grid-2">
          <InputField
            name="dob"
            type="date"
            label={t('form.step1.dob.label')}
            placeholder=""
            error={!!errors.dob}
            helperText={errors.dob ? t(errors.dob.message as string) : ''}
            control={control}
          />
          
          <SelectField
            name="gender"
            label={t('form.step1.gender.label')}
            placeholder={t('form.step1.gender.placeholder')}
            options={[
              { value: 'male', label: t('form.step1.gender.options.male') },
              { value: 'female', label: t('form.step1.gender.options.female') },
              { value: 'other', label: t('form.step1.gender.options.other') },
            ]}
            error={!!errors.gender}
            helperText={errors.gender ? t(errors.gender.message as string) : ''}
            control={control}
          />
        </div>

        <TextAreaField
          name="address"
          label={t('form.step1.address.label')}
          placeholder={t('form.step1.address.placeholder')}
          rows={2}
          control={control}
        />

        <div className="form-grid-3">
          <InputField
            name="city"
            label={t('form.step1.city.label')}
            placeholder={t('form.step1.city.placeholder')}
            control={control}
          />
          
          <InputField
            name="state"
            label={t('form.step1.state.label')}
            placeholder={t('form.step1.state.placeholder')}
            control={control}
          />
          
          <SelectField
            name="country"
            label={t('form.step1.country.label')}
            placeholder={t('form.step1.country.placeholder')}
            options={COUNTRIES}
            error={!!errors.country}
            helperText={errors.country ? t(errors.country.message as string) : ''}
            control={control}
          />
        </div>

        <div className="form-grid-2">
          <PhoneField
            countryCodeName="phoneCountryCode"
            phoneName="phone"
            label={t('form.step1.phone.label')}
            error={!!errors.phone || !!errors.phoneCountryCode}
            helperText={errors.phone ? t(errors.phone.message as string) : errors.phoneCountryCode ? t(errors.phoneCountryCode.message as string) : ''}
            control={control}
          />
          
          <InputField
            name="email"
            type="email"
            label={t('form.step1.email.label')}
            placeholder={t('form.step1.email.placeholder')}
            error={!!errors.email}
            helperText={errors.email ? t(errors.email.message as string) : ''}
            control={control}
          />
        </div>
      </form>
    </div>
  );
}

export default PersonalInfo;