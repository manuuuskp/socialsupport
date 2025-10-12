import { useEffect, useState, useMemo } from 'react';
import { useForm, Controller, type Control } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { updateStep } from '../../../store/socialSupportFormSlice';
import AIHelper from '../../AIHelper';
import { situtationFormSchema } from './situationFormSchema';

type SituationFormData = yup.InferType<typeof situtationFormSchema>;

const TextAreaFieldWithAI = ({
    name,
    label,
    placeholder,
    helpText,
    rows = 4,
    control,
    onAIHelp,
    errors
}: {
    name: keyof SituationFormData;
    label: string;
    placeholder: string;
    helpText: string;
    rows?: number;
    control: Control<SituationFormData>;
    onAIHelp: (fieldKey: string) => void;
    errors?: any;
}) => {
    const { t } = useTranslation();
    const error = errors?.[name];

    return (
        <div className="field-container">
            <div className="flex flex-col mb-3 gap-3 sm:flex-row sm:justify-between sm:items-start sm:mb-2 sm:gap-0">
                <label htmlFor={name} className="field-label">
                    {label}
                </label>
                <button
                    type="button"
                    onClick={() => onAIHelp(name)}
                    className="ai-button w-full justify-center sm:w-auto sm:self-auto"
                >
                    <svg className="w-5 h-5 mr-2 sm:w-4 sm:h-4 sm:mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <span className="sm:hidden">{t('buttons.aiHelper')}</span>
                    <span className="hidden sm:inline">{t('buttons.aiHelper')}</span>
                </button>
            </div>

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
                        className={`${error ? 'textarea-error' : 'textarea-default'} min-h-[120px] sm:min-h-[100px]`}
                        aria-describedby={error ? `${name}-error` : `${name}-help`}
                    />
                )}
            />

            <p id={`${name}-help`} className="mt-2 text-sm text-gray-500 leading-relaxed sm:mt-1 sm:text-xs sm:leading-normal">
                {helpText}
            </p>

            {error && (
                <p id={`${name}-error`} className="field-error">
                    {t(error.message as string)}
                </p>
            )}
        </div>
    );
};

const SituationInfo = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const formData = useAppSelector((state) => state.socialSupportForm.formData);
    const [aiModalOpen, setAIModalOpen] = useState(false);
    const [currentField, setCurrentField] = useState<string>('');

    const {
        control,
        watch,
        setValue,
        formState: { errors },
    } = useForm<SituationFormData>({
        resolver: yupResolver(situtationFormSchema),
        defaultValues: formData.situation,
        mode: 'onChange',
    });

    const watchedValues = watch();

    useEffect(() => {
        const subscription = watch((value) => {
            dispatch(updateStep({ step: 'situation', data: value }));
        });
        return () => subscription.unsubscribe();
    }, [watch, dispatch]);

    const handleAIHelp = (fieldKey: string) => {
        setCurrentField(fieldKey);
        setAIModalOpen(true);
    };

    const handleAIAccept = (text: string) => {
        setValue(currentField as keyof SituationFormData, text, { shouldValidate: true });
        setAIModalOpen(false);
    };

    const getContextText = (fieldKey: string) => {
        let context: {
            field: string;
            applicant: {
                name?: string;
                employmentStatus?: string;
                monthlyIncome?: number;
                dependents?: number;
                housing?: string;
            },
            draftText?: string;
        } = {
            field: fieldKey,
            applicant: {}
        };

        if (formData.personal?.name) {
            context.applicant.name = formData.personal.name;
        }

        if (formData.family?.employmentStatus) {
            context.applicant.employmentStatus = formData.family.employmentStatus;
        }

        if (formData.family?.monthlyIncome) {
            context.applicant.monthlyIncome = formData.family.monthlyIncome;
        }

        if (formData.family?.dependents) {
            context.applicant.dependents = formData.family.dependents;
        }

        if (formData.family?.housingStatus) {
            context.applicant.housing = formData.family.housingStatus;
        }

        const currentValue = watchedValues[fieldKey as keyof SituationFormData];
        if (currentValue) {
            context.draftText = currentValue;
        }

        return context;
    };

    const contextText = useMemo(() => {
        return JSON.stringify(getContextText(currentField));
    }, [currentField, formData, watchedValues]);

    return (
        <div className="page-container max-w-4xl">
            <h1 className="page-title">
                {t('form.step3.title')}
            </h1>

            <form className="form-section">
                <TextAreaFieldWithAI
                    name="financialSituation"
                    label={t('form.step3.financialSituation.label')}
                    placeholder={t('form.step3.financialSituation.placeholder')}
                    helpText={t('form.step3.financialSituation.helpText')}
                    rows={4}
                    control={control}
                    onAIHelp={handleAIHelp}
                    errors={errors}
                />

                <TextAreaFieldWithAI
                    name="employmentCircumstances"
                    label={t('form.step3.employmentCircumstances.label')}
                    placeholder={t('form.step3.employmentCircumstances.placeholder')}
                    helpText={t('form.step3.employmentCircumstances.helpText')}
                    rows={4}
                    control={control}
                    onAIHelp={handleAIHelp}
                    errors={errors}
                />

                <TextAreaFieldWithAI
                    name="reasonForApplying"
                    label={t('form.step3.reasonForApplying.label')}
                    placeholder={t('form.step3.reasonForApplying.placeholder')}
                    helpText={t('form.step3.reasonForApplying.helpText')}
                    rows={4}
                    control={control}
                    onAIHelp={handleAIHelp}
                    errors={errors}
                />
            </form>

            <AIHelper
                open={aiModalOpen}
                onClose={() => setAIModalOpen(false)}
                onAccept={handleAIAccept}
                fieldKey={currentField}
                contextText={contextText}
                tone="professional"
                length="medium"
            />
        </div>
    );
}

export default SituationInfo;