import ApplicationForm from "../components/ApplicationForm";
import ProgressBar from "../components/ProgressBar";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setCurrentStep } from "../store/socialSupportFormSlice";

const SocialSupportForm = () => {
    const steps = ['step1.title', 'step2.title', 'step3.title'];
    const dispatch = useAppDispatch();
    const { currentStep } = useAppSelector(state => state.form);

    return (
        <ApplicationForm>
            <ProgressBar currentStep={currentStep}
                totalSteps={steps.length}
                steps={steps}
                onStepClick={(step) => dispatch(setCurrentStep(step))} />
        </ApplicationForm>

    )
}

export default SocialSupportForm