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
        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8 pt-4 border-t border-gray-200">
            <button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className={`${currentStep === 0 ? 'invisible' : ''} inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-gray-300 shadow-sm text-xs sm:text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
                <span className="hidden sm:inline">{t('buttons.previous')}</span>
                <span className="sm:hidden">{t('buttons.back')}</span>
            </button>

            <div className="flex justify-end">
                {currentStep < steps.length - 1 ? (
                    <button
                        onClick={handleNext}
                        disabled={!isValidStep(currentStep)}
                        className={`inline-flex flex-1 justify-center text-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {t('buttons.next')}
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        disabled={!isValidStep(currentStep) || isSubmitting}
                        className="inline-flex flex-1 justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {t('buttons.submit')}
                    </button>
                )}
            </div>
        </div>
    )
}

export default FormButtonContainer;