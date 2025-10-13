import { useTranslation } from 'react-i18next';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
  onStepClick?: (step: number) => void;
}

const ProgressBar = ({ currentStep, totalSteps, steps, onStepClick }: ProgressBarProps) => {
  const { t } = useTranslation();

  const handleStepClick = (stepIndex: number) => {
    if (onStepClick && stepIndex <= currentStep) {
      onStepClick(stepIndex);
    }
  };

  return (
    <div className="w-full mb-4 px-2 sm:mb-8" role="navigation" aria-label="Progress">
      <div className="mb-2 flex justify-center sm:mb-4">
        <div className="w-full max-w-2xl">
          <ol className="flex items-center justify-center text-xs font-medium text-center text-gray-500 sm:text-sm sm:text-base">
            {steps.map((stepKey, index) => {
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;

              return (
                <li key={stepKey} className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''} ${isActive ? 'text-blue-600' :
                    isCompleted ? 'text-green-600' : 'text-gray-500'
                  }`}>
                  <div className="flex flex-col items-center relative">
                    <button
                      onClick={() => handleStepClick(index)}
                      disabled={index > currentStep}
                      className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 transition-all duration-200 touch-manipulation sm:w-10 sm:h-10 ${isActive ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-300' :
                          isCompleted ? 'bg-green-100 text-green-600 hover:bg-green-200 cursor-pointer active:scale-95' :
                            'bg-gray-100 text-gray-600 cursor-not-allowed'
                        } ${index <= currentStep && !isActive ? 'hover:scale-105 active:scale-95' : ''
                        }`}
                      aria-label={`Go to ${t(`form.${stepKey}`)}`}
                    >
                      {isCompleted ? (
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <span className="text-sm font-semibold sm:text-base">{index + 1}</span>
                      )}
                    </button>
                    <span className="hidden mt-2 text-xs text-center max-w-16 sm:block sm:text-sm sm:max-w-20">
                      {t(`form.${stepKey}`)}
                    </span>
                  </div>

                  {index < steps.length - 1 && (
                    <div className="flex-1 flex items-center justify-center mx-1 sm:mx-4">
                      <div className={`h-px w-full sm:h-0.5 ${index < currentStep ? 'bg-green-400' : 'bg-gray-200'
                        }`}></div>
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      <div className="text-xs text-gray-600 text-center font-medium sm:text-sm" aria-live="polite" aria-atomic="true" role="status">
        <span>
          {t('form.progress.step', { current: currentStep + 1, total: totalSteps })}
        </span>
      </div>
    </div>
  );
}

export default ProgressBar;