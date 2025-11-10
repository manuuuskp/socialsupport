import { useEffect, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import * as yup from "yup";
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { updateStep } from '../../../store/socialSupportFormSlice';
import AIHelper from '../../AIHelper';
import { situtationFormSchema } from './situationFormSchema';
import TextAreaFieldWithAI from '../../form/TextAreaFieldWithAI';
import { getSchemaForStep } from '../../../utils/validation/validation';

const SituationInfo = () => {
    type SituationFormData = yup.InferType<typeof situtationFormSchema>;
    const { t, i18n } = useTranslation();
    const dispatch = useAppDispatch();
    const formData = useAppSelector((state) => state.socialSupportForm.formData);

    const situationSchema = getSchemaForStep(2);

    const [aiModalOpen, setAIModalOpen] = useState(false);
    const [currentField, setCurrentField] = useState('');

    const { control, watch, setValue, formState: { errors } } = useForm<SituationFormData>({
        resolver: yupResolver(situationSchema),
        defaultValues: formData.situation,
        mode: 'onChange',
    });

    const watchedValues = watch();

    const isFieldValid = (fieldName: keyof SituationFormData) => {
        const value = watchedValues[fieldName];
        if (!value || typeof value !== 'string') return false;
        const trimmedValue = value.trim();
        return trimmedValue.length >= 15;
    };

    useEffect(() => {
        const subscription = watch((value) => {
            const trimmedValue = Object.fromEntries(
                Object.entries(value).map(([key, val]) => [
                    key,
                    typeof val === 'string' ? val.trim() : val,
                ])
            );

            dispatch(updateStep({ step: 'situation', data: trimmedValue }));
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

    const handleClose = () => {
        setAIModalOpen(false);
    }

    const handleSetPrompt = (text: string) => {
        setValue(currentField as keyof SituationFormData, text, { shouldValidate: false });
    }

    const getContextText = (fieldKey: string) => {
        const context: any = {
            field: fieldKey,
            applicant: { personal: { ...formData.personal }, family: { ...formData.family } },
            language: i18n.language,
        };

        const draft = watchedValues[fieldKey as keyof SituationFormData];
        if (draft) context.userPrompt = draft;

        return JSON.stringify(context);
    };

    const contextText = useMemo(() => getContextText(currentField), [currentField, formData, watchedValues, i18n.language]);

    return (
        <div className="page-container">
            <h1 className="page-title">{t('form.step3.title')}</h1>

            <form className="space-y-6">
                {['financialSituation', 'employmentCircumstances', 'reasonForApplying'].map((field) => (
                    <TextAreaFieldWithAI
                        key={field}
                        name={field as keyof SituationFormData}
                        label={t(`form.step3.${field}.label`)}
                        placeholder={t(`form.step3.${field}.placeholder`)}
                        helpText={t(`form.step3.${field}.helpText`)}
                        rows={4}
                        control={control}
                        onAIHelp={handleAIHelp}
                        error={t(errors[field as keyof SituationFormData]?.message || '')}
                        isValid={isFieldValid(field as keyof SituationFormData)}
                    />
                ))}
            </form>

            <AIHelper
                open={aiModalOpen}
                onClose={handleClose}
                onAccept={handleAIAccept}
                fieldKey={currentField}
                contextText={contextText}
                tone="professional"
                length="medium"
                userPrompt={watchedValues[currentField as keyof SituationFormData]}
                setUserPrompt={handleSetPrompt}
            />
        </div>
    );
};

export default SituationInfo;
