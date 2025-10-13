import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { updateStep } from '../../../store/socialSupportFormSlice';
import { familyFormSchema } from './familyFormSchema';
import { CURRENCIES } from '../../../utils/constants/constants';
import SelectField from '../../form/SelectField';
import InputField from '../../form/InputField';
import IncomeField from '../../form/CurrencyField';

type FamilyFormData = yup.InferType<typeof familyFormSchema>;

const FamilyInfo = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const formData = useAppSelector((state) => state.socialSupportForm.formData);

    const {
        control,
        watch,
        formState: { errors },
    } = useForm<FamilyFormData>({
        resolver: yupResolver(familyFormSchema),
        defaultValues: formData.family,
        mode: 'onChange',
    });

    useEffect(() => {
        const subscription = watch((value) => {
            dispatch(updateStep({ step: 'family', data: value }));
        });
        return () => subscription.unsubscribe();
    }, [watch, dispatch]);

    return (
        <div className="page-container">
            <h1 className="page-title">
                {t('form.step2.title')}
            </h1>

            <form className="form-section">
                <div className="form-grid-2">
                    <SelectField
                        name="maritalStatus"
                        label={t('form.step2.maritalStatus.label')}
                        placeholder={t('form.step2.maritalStatus.placeholder')}
                        options={[
                            { value: 'single', label: t('form.step2.maritalStatus.options.single') },
                            { value: 'married', label: t('form.step2.maritalStatus.options.married') },
                            { value: 'widowed', label: t('form.step2.maritalStatus.options.widowed') },
                            { value: 'divorced', label: t('form.step2.maritalStatus.options.divorced') },
                        ]}
                        error={!!errors.maritalStatus}
                        helperText={errors.maritalStatus ? t(errors.maritalStatus.message as string) : ''}
                        control={control}
                    />

                    <InputField
                        name="dependents"
                        label={t('form.step2.dependents.label')}
                        placeholder={t('form.step2.dependents.placeholder')}
                        type='number'
                        min={0}
                        step={1}
                        control={control}
                        error={!!errors.dependents}
                        helperText={errors.dependents ? t(errors.dependents.message as string) : ''}
                    />
                </div>

                <SelectField
                    name="employmentStatus"
                    label={t('form.step2.employmentStatus.label')}
                    placeholder={t('form.step2.employmentStatus.placeholder')}
                    options={[
                        { value: 'employed', label: t('form.step2.employmentStatus.options.employed') },
                        { value: 'unemployed', label: t('form.step2.employmentStatus.options.unemployed') },
                        { value: 'self-employed', label: t('form.step2.employmentStatus.options.self-employed') },
                        { value: 'student', label: t('form.step2.employmentStatus.options.student') },
                    ]}
                    error={!!errors.employmentStatus}
                    helperText={errors.employmentStatus ? t(errors.employmentStatus.message as string) : ''}
                    control={control}
                />

                <IncomeField
                    currencyName="incomeCurrency"
                    incomeName="monthlyIncome"
                    label={t('form.step2.monthlyIncome.label')}
                    error={!!errors.monthlyIncome || !!errors.incomeCurrency}
                    helperText={errors.monthlyIncome ? t(errors.monthlyIncome.message as string) : errors.incomeCurrency ? t(errors.incomeCurrency.message as string) : ''}
                    control={control}
                    currencies={CURRENCIES}
                />

                <SelectField
                    name="housingStatus"
                    label={t('form.step2.housingStatus.label')}
                    placeholder={t('form.step2.housingStatus.placeholder')}
                    options={[
                        { value: 'owned', label: t('form.step2.housingStatus.options.owned') },
                        { value: 'rented', label: t('form.step2.housingStatus.options.rented') },
                        { value: 'shelter', label: t('form.step2.housingStatus.options.shelter') },
                        { value: 'homeless', label: t('form.step2.housingStatus.options.homeless') },
                    ]}
                    error={!!errors.housingStatus}
                    helperText={errors.housingStatus ? t(errors.housingStatus.message as string) : ''}
                    control={control}
                />
            </form>
        </div>
    );
}

export default FamilyInfo;