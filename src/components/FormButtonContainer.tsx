import { useTranslation } from "react-i18next";

interface FormButtonContainerProps {
    currentStep: number;
    steps: string[];
    isSubmitting: boolean;
    isValidStep: (step: number) => boolean;
    handleSubmit: () => void;
    handleNext: () => void;
    handlePrevious: () => void;
}

const FormButtonContainer = ({ currentStep, steps, isValidStep, isSubmitting, handleSubmit, handleNext, handlePrevious }: FormButtonContainerProps) => {

    const { t } = useTranslation();

    return (
        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8 pt-6 pb-4 sm:pb-0 border-t border-gray-200 mobile-button-spacing">
            <button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className={`${currentStep === 0 ? 'invisible' : ''} btn-secondary`}
            >
                <span className="hidden sm:inline">{t('buttons.previous')}</span>
                <span className="sm:hidden">{t('buttons.back')}</span>
            </button>

            <div className="flex justify-end">
                {currentStep < steps.length - 1 ? (
                    <button
                        onClick={handleNext}
                        disabled={!isValidStep(currentStep)}
                        className={`flex-1 btn-primary`}
                    >
                        {t('buttons.next')}
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        disabled={!isValidStep(currentStep) || isSubmitting}
                        className="btn-submit flex-1"
                    >
                        {t('buttons.submit')}
                    </button>
                )}
            </div>
        </div>
    )
}

export default FormButtonContainer;