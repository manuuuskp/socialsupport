import * as yup from "yup";
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

const SocialSupportForm = () => {
    const steps = ['step1.title', 'step2.title', 'step3.title'];
    const TOTAL_STEPS = steps.length;
    const dispatch = useAppDispatch();
    const { formData, currentStep } = useAppSelector(state => state.form);

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
        switch (step) {
            case 0:
                try {
                    personalFormSchema.validateSync(formData.personal, { abortEarly: false });
                    return true;
                } catch (error) {
                    if (error instanceof yup.ValidationError) {
                        console.log("Validation errors:", error.inner);
                    }
                    return false;
                }
            case 1:
                try {
                    familyFormSchema.validateSync(formData.family, { abortEarly: false });
                    return true;
                } catch (error) {
                    if (error instanceof yup.ValidationError) {
                        console.log("Validation errors:", error.inner);
                    }
                    return false;
                }
            default:
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
            <ProgressBar currentStep={currentStep}
                totalSteps={TOTAL_STEPS}
                steps={steps}
                onStepClick={(step) => dispatch(setCurrentStep(step))} />

            <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 md:p-8 mb-8">
                <div className="min-h-[300px] sm:min-h-[400px]">
                    {renderCurrentStep()}
                    <FormButtonContainer currentStep={currentStep} steps={steps} isSubmitting={false} handleNext={handleNext} handlePrevious={handlePrevious} isValidStep={isValidStep} handleSubmit={() => { }} />
                </div>
            </div>
        </ApplicationForm>
    )
}

export default SocialSupportForm