import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { updateStep } from '../../../store/socialSupportFormSlice';
import { COUNTRIES, COUNTRY_CODES } from '../../../utils/constants/constants';
import InputField from '../../form/InputField';
import SelectField from '../../form/SelectField';
import TextAreaField from '../../form/TextAreaField';
import PhoneField from '../../form/PhoneField';
import { personalFormSchema } from './personalFormSchema';

type PersonalFormData = yup.InferType<typeof personalFormSchema>;

const PersonalInfo = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const formData = useAppSelector((state) => state.socialSupportForm.formData);

  const {
    control,
    watch,
    formState: { errors },
  } = useForm<PersonalFormData>({
    resolver: yupResolver(personalFormSchema) as any,
    defaultValues: formData.personal,
    mode: 'onChange',
  });

  useEffect(() => {
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
          error={!!errors.address}
          helperText={errors.address ? t(errors.address.message as string) : ''}
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
            countryCodes={COUNTRY_CODES}
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