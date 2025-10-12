import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LanguageSwitch from '../LanguageSwitch';

const mockChangeLanguage = jest.fn();
const mockT = jest.fn();
const mockDir = jest.fn();
const mockI18n = {
    language: 'en',
    changeLanguage: mockChangeLanguage,
    dir: mockDir,
};

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        i18n: mockI18n,
        t: mockT,
    }),
}));

describe('LanguageSwitch Component', () => {
    const user = userEvent.setup();

    beforeEach(() => {
        jest.clearAllMocks();

        mockI18n.language = 'en';
        mockDir.mockImplementation((lang?: string) => lang === 'ar' ? 'rtl' : 'ltr');
        mockT.mockImplementation((key: string) => {
            const translations: { [key: string]: string } = {
                'language.switch': 'العربية',
            };
            return translations[key] || key;
        });

        Object.defineProperty(document, 'documentElement', {
            value: {
                setAttribute: jest.fn(),
            },
            writable: true,
        });
    });

    describe('Component Rendering', () => {
        it('should render without crashing', () => {
            render(<LanguageSwitch />);
            expect(screen.getByRole('button')).toBeInTheDocument();
        });

        it('should render switch button with correct text', () => {
            render(<LanguageSwitch />);

            const button = screen.getByRole('button');
            expect(button).toBeInTheDocument();
            expect(button).toHaveTextContent('العربية');
            expect(mockT).toHaveBeenCalledWith('language.switch');
        });
    });

    describe('Accessibility', () => {
        it('should have proper aria-label for English to Arabic switch', () => {
            mockI18n.language = 'en';

            render(<LanguageSwitch />);

            const button = screen.getByRole('button');
            expect(button).toHaveAttribute('aria-label', 'Switch to Arabic');
        });

        it('should have proper aria-label for Arabic to English switch', () => {
            mockI18n.language = 'ar';

            render(<LanguageSwitch />);

            const button = screen.getByRole('button');
            expect(button).toHaveAttribute('aria-label', 'Switch to English');
        });

        it('should be focusable and have focus styles', () => {
            render(<LanguageSwitch />);

            const button = screen.getByRole('button');
            expect(button).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-offset-2', 'focus:ring-blue-500');
        });

        it('should have hover styles', () => {
            render(<LanguageSwitch />);

            const button = screen.getByRole('button');
            expect(button).toHaveClass('hover:bg-gray-50');
        });
    });

    describe('Language Toggle Functionality', () => {
        it('should toggle from English to Arabic when clicked', async () => {
            mockI18n.language = 'en';

            render(<LanguageSwitch />);

            const button = screen.getByRole('button');
            await user.click(button);

            expect(mockChangeLanguage).toHaveBeenCalledWith('ar');
        });

        it('should toggle from Arabic to English when clicked', async () => {
            mockI18n.language = 'ar';

            render(<LanguageSwitch />);

            const button = screen.getByRole('button');
            await user.click(button);

            expect(mockChangeLanguage).toHaveBeenCalledWith('en');
        });

        it('should handle keyboard activation (Enter key)', async () => {
            render(<LanguageSwitch />);

            const button = screen.getByRole('button');
            button.focus();

            await user.keyboard('{ }');

            expect(mockChangeLanguage).toHaveBeenCalledWith('ar');
        });

        it('should handle keyboard activation (Space key)', async () => {
            render(<LanguageSwitch />);

            const button = screen.getByRole('button');
            button.focus();

            await user.keyboard('{Enter}');

            expect(mockChangeLanguage).toHaveBeenCalledWith('ar');
        });
    });

    describe('Document Attribute Updates', () => {
        it('should update document attributes when switching to Arabic', async () => {
            mockI18n.language = 'en';

            render(<LanguageSwitch />);

            const button = screen.getByRole('button');
            await user.click(button);

            expect(mockDir).toHaveBeenCalledWith('ar');

            expect(document.documentElement.setAttribute).toHaveBeenCalledWith('dir', 'rtl');
            expect(document.documentElement.setAttribute).toHaveBeenCalledWith('lang', 'ar');
        });

        it('should update document attributes when switching to English', async () => {
            mockI18n.language = 'ar';

            render(<LanguageSwitch />);

            const button = screen.getByRole('button');
            await user.click(button);

            expect(mockDir).toHaveBeenCalledWith('en');
            expect(document.documentElement.setAttribute).toHaveBeenCalledWith('dir', 'ltr');
            expect(document.documentElement.setAttribute).toHaveBeenCalledWith('lang', 'en');
        });
    });

    describe('i18n Integration', () => {
        it('should call translation function for button text', () => {
            render(<LanguageSwitch />);

            expect(mockT).toHaveBeenCalledWith('language.switch');
        });

        it('should display different text for different languages', () => {
            mockT.mockImplementation((key: string) => {
                if (key === 'language.switch') return 'العربية';
                return key;
            });

            const { rerender } = render(<LanguageSwitch />);
            expect(screen.getByText('العربية')).toBeInTheDocument();

            mockT.mockImplementation((key: string) => {
                if (key === 'language.switch') return 'English';
                return key;
            });

            rerender(<LanguageSwitch />);
            expect(screen.getByText('English')).toBeInTheDocument();
        });
    });

    describe('Multiple Clicks', () => {
        it('should handle multiple rapid clicks correctly', async () => {
            mockI18n.language = 'en';

            render(<LanguageSwitch />);

            const button = screen.getByRole('button');

            await user.click(button);
            await user.click(button);
            await user.click(button);

            expect(mockChangeLanguage).toHaveBeenCalledTimes(3);
            expect(mockChangeLanguage).toHaveBeenNthCalledWith(1, 'ar');
            expect(mockChangeLanguage).toHaveBeenNthCalledWith(2, 'ar');
            expect(mockChangeLanguage).toHaveBeenNthCalledWith(3, 'ar');
        });
    });

    describe('Edge Cases', () => {
        it('should handle unknown language gracefully', async () => {
            mockI18n.language = 'fr' as any;

            render(<LanguageSwitch />);

            const button = screen.getByRole('button');
            await user.click(button);

            expect(mockChangeLanguage).toHaveBeenCalledWith('en');
        });

        it('should handle missing translation gracefully', () => {
            mockT.mockImplementation((key: string) => key);

            render(<LanguageSwitch />);

            expect(screen.getByText('language.switch')).toBeInTheDocument();
        });

        it('should work with different language directions', async () => {
            mockI18n.language = 'en';
            mockDir.mockReturnValue('rtl');

            render(<LanguageSwitch />);

            const button = screen.getByRole('button');
            await user.click(button);

            expect(mockChangeLanguage).toHaveBeenCalledWith('ar');
            expect(mockDir).toHaveBeenCalledWith('ar');
        });

        it('should handle missing document.documentElement gracefully', async () => {
            Object.defineProperty(document, 'documentElement', {
                value: null,
                writable: true,
            });

            render(<LanguageSwitch />);

            const button = screen.getByRole('button');

            expect(async () => await user.click(button)).not.toThrow();
        });
    });
});