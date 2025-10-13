import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProgressBar from '../ProgressBar';

const mockT = jest.fn();
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: mockT,
    }),
}));

describe('ProgressBar Component', () => {
    const user = userEvent.setup();
    const defaultProps = {
        currentStep: 1,
        totalSteps: 3,
        steps: ['step1', 'step2', 'step3'],
        onStepClick: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();

        mockT.mockImplementation((key: string, options?: any) => {
            const translations: { [key: string]: string } = {
                'form.step1': 'Personal Information',
                'form.step2': 'Family Information',
                'form.step3': 'Situation Information',
                'form.progress.step': `Step ${options?.current} of ${options?.total}`,
            };
            return translations[key] || key;
        });
    });

    describe('Component Rendering', () => {
        it('should render without crashing', () => {
            render(<ProgressBar {...defaultProps} />);
            expect(screen.getByRole('navigation')).toBeInTheDocument();
        });

        it('should render correct number of steps', () => {
            render(<ProgressBar {...defaultProps} />);

            const stepButtons = screen.getAllByRole('button');
            expect(stepButtons).toHaveLength(3);
        });

        it('should render step labels', () => {
            render(<ProgressBar {...defaultProps} />);

            expect(screen.getByText('Personal Information')).toBeInTheDocument();
            expect(screen.getByText('Family Information')).toBeInTheDocument();
            expect(screen.getByText('Situation Information')).toBeInTheDocument();
        });

        it('should render progress text', () => {
            render(<ProgressBar {...defaultProps} />);

            expect(screen.getByText('Step 2 of 3')).toBeInTheDocument();
            expect(mockT).toHaveBeenCalledWith('form.progress.step', { current: 2, total: 3 });
        });

        it('should have proper navigation role and aria-label', () => {
            render(<ProgressBar {...defaultProps} />);

            const navigation = screen.getByRole('navigation');
            expect(navigation).toHaveAttribute('aria-label', 'Progress');
        });
    });

    describe('Step States', () => {
        it('should correctly identify active step', () => {
            render(<ProgressBar {...defaultProps} />);

            const stepButtons = screen.getAllByRole('button');
            const activeStep = stepButtons[1];

            expect(activeStep).toHaveClass('bg-blue-100', 'text-blue-600', 'ring-2', 'ring-blue-300');
        });

        it('should correctly identify completed steps', () => {
            render(<ProgressBar {...defaultProps} />);

            const stepButtons = screen.getAllByRole('button');
            const completedStep = stepButtons[0];

            expect(completedStep).toHaveClass('bg-green-100', 'text-green-600');
        });

        it('should correctly identify pending steps', () => {
            render(<ProgressBar {...defaultProps} />);

            const stepButtons = screen.getAllByRole('button');
            const pendingStep = stepButtons[2];

            expect(pendingStep).toHaveClass('bg-gray-100', 'text-gray-600', 'cursor-not-allowed');
            expect(pendingStep).toBeDisabled();
        });

        it('should show checkmarks for completed steps', () => {
            render(<ProgressBar {...defaultProps} />);

            const stepButtons = screen.getAllByRole('button');
            const completedStep = stepButtons[0];

            const svg = completedStep.querySelector('svg');
            expect(svg).toBeInTheDocument();
        });

        it('should show step numbers for active and pending steps', () => {
            render(<ProgressBar {...defaultProps} />);

            const stepButtons = screen.getAllByRole('button');

            expect(stepButtons[1]).toHaveTextContent('2');

            expect(stepButtons[2]).toHaveTextContent('3');
        });
    });

    describe('Step Click Functionality', () => {
        it('should call onStepClick when clicking completed step', async () => {
            const onStepClick = jest.fn();

            render(<ProgressBar {...defaultProps} onStepClick={onStepClick} />);

            const stepButtons = screen.getAllByRole('button');
            await user.click(stepButtons[0]);

            expect(onStepClick).toHaveBeenCalledWith(0);
        });

        it('should call onStepClick when clicking current step', async () => {
            const onStepClick = jest.fn();

            render(<ProgressBar {...defaultProps} onStepClick={onStepClick} />);

            const stepButtons = screen.getAllByRole('button');
            await user.click(stepButtons[1]);

            expect(onStepClick).toHaveBeenCalledWith(1);
        });

        it('should not call onStepClick when clicking future step', async () => {
            const onStepClick = jest.fn();

            render(<ProgressBar {...defaultProps} onStepClick={onStepClick} />);

            const stepButtons = screen.getAllByRole('button');
            await user.click(stepButtons[2]);

            expect(onStepClick).not.toHaveBeenCalled();
        });

        it('should not call onStepClick when onStepClick is undefined', async () => {
            render(<ProgressBar {...{ ...defaultProps, onStepClick: undefined }} />);

            const stepButtons = screen.getAllByRole('button');

            expect(async () => await user.click(stepButtons[0])).not.toThrow();
        });

        it('should handle keyboard navigation (Enter key)', async () => {
            const onStepClick = jest.fn();

            render(<ProgressBar {...defaultProps} onStepClick={onStepClick} />);

            const stepButtons = screen.getAllByRole('button');
            stepButtons[0].focus();

            await user.keyboard('{Enter}');

            expect(onStepClick).toHaveBeenCalledWith(0);
        });

        it('should handle keyboard navigation (Space key)', async () => {
            const onStepClick = jest.fn();
            const user = userEvent.setup();

            render(<ProgressBar {...defaultProps} onStepClick={onStepClick} />);

            const stepButtons = screen.getAllByRole('button');
            stepButtons[0].focus();

            await user.keyboard('{ }');

            expect(onStepClick).toHaveBeenCalledWith(0);
        });
    });

    describe('Progress Indicator Lines', () => {
        it('should render progress indicator structure', () => {
            render(<ProgressBar {...defaultProps} />);

            const container = screen.getByRole('navigation');
            expect(container).toBeInTheDocument();

            const stepButtons = screen.getAllByRole('button');
            expect(stepButtons).toHaveLength(3);
        });

        it('should show proper step structure with connectors', () => {
            render(<ProgressBar {...defaultProps} />);

            const container = screen.getByRole('navigation');
            const listItems = container.querySelectorAll('li');

            expect(listItems.length).toBe(3);
        });
    });

    describe('Accessibility', () => {
        it('should have proper aria-labels for step buttons', () => {
            render(<ProgressBar {...defaultProps} />);

            const stepButtons = screen.getAllByRole('button');

            expect(stepButtons[0]).toHaveAttribute('aria-label', 'Go to Personal Information');
            expect(stepButtons[1]).toHaveAttribute('aria-label', 'Go to Family Information');
            expect(stepButtons[2]).toHaveAttribute('aria-label', 'Go to Situation Information');
        });

        it('should have aria-live region for progress text', () => {
            render(<ProgressBar {...defaultProps} />);

            const liveRegion = screen.getByRole('status');
            expect(liveRegion).toHaveAttribute('aria-live', 'polite');
        });

        it('should disable future steps properly', () => {
            render(<ProgressBar {...defaultProps} />);

            const stepButtons = screen.getAllByRole('button');
            const futureStep = stepButtons[2];

            expect(futureStep).toBeDisabled();
            expect(futureStep).toHaveClass('cursor-not-allowed');
        });
    });

    describe('Different Step Configurations', () => {
        it('should handle single step', () => {
            const singleStepProps = {
                currentStep: 0,
                totalSteps: 1,
                steps: ['onlyStep'],
                onStepClick: jest.fn(),
            };

            mockT.mockImplementation((key: string, options?: any) => {
                if (key === 'form.progress.step') return `Step ${options?.current} of ${options?.total}`;
                return 'Only Step';
            });

            render(<ProgressBar {...singleStepProps} />);

            expect(screen.getByRole('button')).toBeInTheDocument();
            expect(screen.getByText('Step 1 of 1')).toBeInTheDocument();
        });

        it('should handle many steps', () => {
            const manyStepsProps = {
                currentStep: 2,
                totalSteps: 5,
                steps: ['step1', 'step2', 'step3', 'step4', 'step5'],
                onStepClick: jest.fn(),
            };

            render(<ProgressBar {...manyStepsProps} />);

            const stepButtons = screen.getAllByRole('button');
            expect(stepButtons).toHaveLength(5);
            expect(screen.getByText('Step 3 of 5')).toBeInTheDocument();
        });

        it('should handle last step', () => {
            const lastStepProps = {
                ...defaultProps,
                currentStep: 2,
            };

            render(<ProgressBar {...lastStepProps} />);

            expect(screen.getByText('Step 3 of 3')).toBeInTheDocument();

            const stepButtons = screen.getAllByRole('button');
            expect(stepButtons[0].querySelector('svg')).toBeInTheDocument();
            expect(stepButtons[1].querySelector('svg')).toBeInTheDocument();
            expect(stepButtons[2]).toHaveClass('bg-blue-100');
        });
    });

    describe('i18n Integration', () => {
        it('should translate step labels correctly', () => {
            mockT.mockImplementation((key: string) => {
                const arabicTranslations: { [key: string]: string } = {
                    'form.step1': 'المعلومات الشخصية',
                    'form.step2': 'معلومات العائلة',
                    'form.step3': 'معلومات الحالة',
                };
                return arabicTranslations[key] || key;
            });

            render(<ProgressBar {...defaultProps} />);

            expect(screen.getByText('المعلومات الشخصية')).toBeInTheDocument();
            expect(screen.getByText('معلومات العائلة')).toBeInTheDocument();
            expect(screen.getByText('معلومات الحالة')).toBeInTheDocument();
        });

        it('should handle missing translations gracefully', () => {
            mockT.mockImplementation((key: string) => key);

            render(<ProgressBar {...defaultProps} />);

            expect(screen.getByText('form.step1')).toBeInTheDocument();
            expect(screen.getByText('form.step2')).toBeInTheDocument();
            expect(screen.getByText('form.step3')).toBeInTheDocument();
        });
    });

    describe('Edge Cases', () => {
        it('should handle negative currentStep', () => {
            const negativeProps = {
                ...defaultProps,
                currentStep: -1,
            };

            render(<ProgressBar {...negativeProps} />);

            const stepButtons = screen.getAllByRole('button');
            stepButtons.forEach(button => {
                expect(button).toBeDisabled();
            });
        });

        it('should handle currentStep beyond totalSteps', () => {
            const beyondProps = {
                ...defaultProps,
                currentStep: 5,
            };

            render(<ProgressBar {...beyondProps} />);

            const stepButtons = screen.getAllByRole('button');
            stepButtons.forEach(button => {
                expect(button.querySelector('svg')).toBeInTheDocument();
            });
        });
    });
});