import { render, screen } from '@testing-library/react';
import Header from '../Header';

jest.mock('../LanguageSwitch', () => {
  return function MockLanguageSwitch() {
    return <div data-testid="mock-language-switch">Language Switch</div>;
  };
});

const mockT = jest.fn();
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: mockT,
  }),
}));

describe('Header Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockT.mockImplementation((key: string) => {
      const translations: { [key: string]: string } = {
        'app.title': 'Social Support Application',
      };
      return translations[key] || key;
    });
  });

  describe('Component Rendering', () => {
    it('should render without crashing', () => {
      const { container } = render(<Header />);
      const header = container.firstChild;
      expect(header).toBeInTheDocument();
    });

    it('should render the application title', () => {
      render(<Header />);
      
      expect(screen.getByText('Social Support Application')).toBeInTheDocument();
      expect(mockT).toHaveBeenCalledWith('app.title');
    });

    it('should render the LanguageSwitch component', () => {
      render(<Header />);
      
      expect(screen.getByTestId('mock-language-switch')).toBeInTheDocument();
      expect(screen.getByTestId('mock-language-switch')).toHaveTextContent('Language Switch');
    });

    it('should have proper header structure', () => {
      const { container } = render(<Header />);
      
      const header = container.firstChild;
      expect(header).toHaveClass('h-16', 'flex', 'items-center', 'justify-between');
    });
  });

  describe('Layout and Styling', () => {
    it('should render as h1 element', () => {
      render(<Header />);
      
      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('Social Support Application');
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(<Header />);
      
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
    });

    it('should have semantic header structure', () => {
      const { container } = render(<Header />);
      
      const header = container.firstChild;
      expect(header?.nodeName).toBe('DIV');
    });
  });

  describe('i18n Integration', () => {
    it('should call translation function with correct key', () => {
      render(<Header />);
      
      expect(mockT).toHaveBeenCalledWith('app.title');
    });

    it('should display translated title text', () => {
      mockT.mockImplementation((key: string) => {
        if (key === 'app.title') return 'تطبيق الدعم الاجتماعي';
        return key;
      });

      render(<Header />);
      
      expect(screen.getByText('تطبيق الدعم الاجتماعي')).toBeInTheDocument();
    });

    it('should handle missing translation gracefully', () => {
      mockT.mockImplementation((key: string) => key);

      render(<Header />);
      
      expect(screen.getByText('app.title')).toBeInTheDocument();
    });
  });

  describe('Component Integration', () => {
    it('should integrate with LanguageSwitch component', () => {
      const { container } = render(<Header />);
      
      const header = container.firstChild;
      const languageSwitch = screen.getByTestId('mock-language-switch');
      
      expect(header).toContainElement(languageSwitch);
    });
  });

  describe('Responsive Design', () => {
    it('should handle long titles with truncation', () => {
      mockT.mockImplementation(() => 'This is a very long application title that should be truncated on smaller screens');

      render(<Header />);
      
      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toHaveClass('truncate');
    });
  });
});