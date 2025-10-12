import { useEffect, useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import * as yup from "yup";
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { updateStep } from '../../../store/socialSupportFormSlice';
import AIHelper from '../../AIHelper';
import { situtationFormSchema } from './situationFormSchema';
import TextAreaFieldWithAI from '../../form/TextAreaFieldWithAI';

const SituationInfo = () => {
  type SituationFormData = yup.InferType<typeof situtationFormSchema>;
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const formData = useAppSelector((state) => state.socialSupportForm.formData);

  const [aiModalOpen, setAIModalOpen] = useState(false);
  const [currentField, setCurrentField] = useState('');
  const [userPrompt, setUserPrompt] = useState('');

  const { control, watch, setValue, formState: { errors } } = useForm<SituationFormData>({
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
    setUserPrompt('');
    setAIModalOpen(true);
  };

  const handleAIAccept = (text: string) => {
    setValue(currentField as keyof SituationFormData, text, { shouldValidate: true });
    setAIModalOpen(false);
  };

  const getContextText = (fieldKey: string) => {
    const context: any = {
      field: fieldKey,
      applicant: { ...formData.personal, ...formData.family },
      language: i18n.language,
    };

    const draft = watchedValues[fieldKey as keyof SituationFormData];
    if (draft) context.draftText = draft;
    if (userPrompt) context.userPrompt = userPrompt;

    return JSON.stringify(context);
  };

  const contextText = useMemo(() => getContextText(currentField), [currentField, formData, watchedValues, userPrompt, i18n.language]);

  return (
    <div className="px-4 py-6 max-w-4xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">{t('form.step3.title')}</h1>

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
          />
        ))}
      </form>

      <AIHelper
        open={aiModalOpen}
        onClose={() => setAIModalOpen(false)}
        onAccept={handleAIAccept}
        fieldKey={currentField}
        contextText={contextText}
        tone="professional"
        length="medium"
        userPrompt={userPrompt}
        setUserPrompt={setUserPrompt}
      />
    </div>
  );
};

export default SituationInfo;
