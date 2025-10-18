import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import i18n from "../i18n";
import ApplicationForm from "../components/ApplicationForm";
import FormButtonContainer from "../components/FormButtonContainer";
import ProgressBar from "../components/ProgressBar";
import PersonalInfo from "../components/socialsupportform/personalInfo/PersonalInfo";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setCurrentStep } from "../store/socialSupportFormSlice";
import { personalFormSchema } from "../components/socialsupportform/personalInfo/personalFormSchema";
import FamilyInfo from "../components/socialsupportform/familyInfo/FamilyInfo";
import { familyFormSchema } from "../components/socialsupportform/familyInfo/familyFormSchema";
import SituationInfo from "../components/socialsupportform/situationInfo/SituationInfo";
import { situtationFormSchema } from "../components/socialsupportform/situationInfo/situationFormSchema";
import { useSubmitSocialSupportForm } from "../hooks/useSubmitSocialSupportForm";

interface SocialSupportFormProps {
    onSubmissionSuccess?: (applicationId: string) => void;
}

const SocialSupportForm = ({ onSubmissionSuccess }: SocialSupportFormProps) => {
    const steps = ['step1.title', 'step2.title', 'step3.title'];
    const TOTAL_STEPS = steps.length;
    const dispatch = useAppDispatch();
    const { formData, currentStep } = useAppSelector(state => state.socialSupportForm);
    const { isSubmitting, submitForm } = useSubmitSocialSupportForm();

    const handleSubmit = async () => {
        const applicationId = await submitForm();
        if (applicationId && onSubmissionSuccess) {
            onSubmissionSuccess(applicationId);
        }
    };

    const handleNext = () => {
        if (currentStep < TOTAL_STEPS - 1) {
            dispatch(setCurrentStep(currentStep + 1));
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            dispatch(setCurrentStep(currentStep - 1));
        }
    };

    const isValidStep = (step: number): boolean => {
        try {
            switch (step) {
                case 0:
                    personalFormSchema.validateSync(formData.personal, { abortEarly: false });
                    break;
                case 1:
                    familyFormSchema.validateSync(formData.family, { abortEarly: false });
                    break;
                case 2:
                    situtationFormSchema.validateSync(formData.situation, { abortEarly: false });
                    break;
                default:
                    return false;
            }
            return true;
        } catch (error) {
            return false;
        }
    };

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 0:
                return <PersonalInfo />
            case 1:
                return <FamilyInfo />
            case 2:
                return <SituationInfo />
            default:
                return null;
        }
    };

    return (
        <ApplicationForm>
            {
                steps.length > 1 && <ProgressBar currentStep={currentStep}
                    totalSteps={TOTAL_STEPS}
                    steps={steps}
                    onStepClick={(step) => dispatch(setCurrentStep(step))} />
            }

            <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 md:p-8 mb-8">
                <div className="min-h-[300px] sm:min-h-[400px]">
                    {renderCurrentStep()}
                    <FormButtonContainer currentStep={currentStep} steps={steps} isSubmitting={isSubmitting} handleNext={handleNext} handlePrevious={handlePrevious} isValidStep={isValidStep} handleSubmit={handleSubmit} />
                </div>
            </div>
            <ToastContainer rtl={i18n.dir(i18n.language) === 'rtl'} position="bottom-left" autoClose={1500} />
        </ApplicationForm>
    )
}

export default SocialSupportForm