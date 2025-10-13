import { useState } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { resetForm } from '../store/socialSupportFormSlice';
import api from '../services/api';

export const useSubmitSocialSupportForm = () => {
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formData = useAppSelector(state => state.socialSupportForm.formData);
  const { t } = useTranslation();

  const submitForm = async () => {
    try {
      setIsSubmitting(true);
      await api.post('/social-support', formData);

      dispatch(resetForm());

      localStorage.removeItem('socialSupportForm');

      toast.success(t('form.submission.success'));

    } catch (error: any) {
      console.error('Error submitting form:', error);
      const message = error.response?.data?.message || t('form.submission.failure');
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { isSubmitting, submitForm };
};
