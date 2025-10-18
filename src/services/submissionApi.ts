export interface SubmissionResponse {
  applicationId: string;
  status: 'success' | 'error';
  message: string;
  timestamp: string;
}

const generateApplicationId = (): string => {
  const timestamp = Date.now().toString();
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `SSA-${timestamp.slice(-6)}-${randomPart}`;
};

export const submitSocialSupportApplication = async (_formData: any): Promise<SubmissionResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const applicationId = generateApplicationId();
      
      resolve({
        applicationId,
        status: 'success',
        message: 'Application submitted successfully',
        timestamp: new Date().toISOString()
      });
    }, 2000);
  });
};