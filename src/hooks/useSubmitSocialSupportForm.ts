import { useAppDispatch, useAppSelector } from '../store/hooks';
import { resetForm } from '../store/socialSupportFormSlice';
import { api } from '../services/api';
import { toast } from 'react-toastify';

export const useSubmitSocialSupportForm = () => {
  const dispatch = useAppDispatch();
  const formData = useAppSelector(state => state.socialSupportForm.formData);

  const submitForm = async () => {
    try {
      await api.post('/social-support', formData);

      dispatch(resetForm());

      localStorage.removeItem('socialSupportForm');

      toast.success('Form submitted successfully!');

    } catch (error: any) {
      console.error('Error submitting form:', error);
      const message = error.response?.data?.message || 'Failed to submit form. Please try again.';
      toast.error(message);
    }
  };

  return { submitForm };
};
