import { useState } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { formSliceName, resetForm } from '../store/socialSupportFormSlice';
import { submitSocialSupportApplication } from '../services/submissionApi';
import { removeAppStateSlice } from '../utils/storage/storage';

export const useSubmitSocialSupportForm = () => {
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formData = useAppSelector(state => state.socialSupportForm.formData);
  const { t } = useTranslation();

  const submitForm = async (): Promise<string | null> => {
    try {
      setIsSubmitting(true);
      
      const response = await submitSocialSupportApplication(formData);

      dispatch(resetForm());
      removeAppStateSlice(formSliceName);

      return response.applicationId;

    } catch (error: any) {
      const message = error.message || t('form.submission.failure');
      toast.error(message);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { isSubmitting, submitForm };
};
