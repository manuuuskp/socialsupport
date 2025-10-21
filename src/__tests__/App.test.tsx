import { render, screen } from '@testing-library/react';
import { act } from '@testing-library/react';
import App from '../App';

jest.mock('../hooks/useGlobalErrorHandler', () => ({
  useGlobalErrorHandler: jest.fn(),
}));

jest.mock('../components/ErrorBoundary', () => {
  return function MockErrorBoundary({ children }: { children: React.ReactNode }) {
    return <div data-testid="mock-error-boundary">{children}</div>;
  };
});

jest.mock('../components/GlobalErrorProvider', () => ({
  GlobalErrorProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-global-error-provider">{children}</div>
  ),
}));

jest.mock('../pages/Layout', () => {
  return function MockLayout() {
    return <div data-testid="mock-layout">Layout Component</div>;
  };
});

jest.mock('../store', () => ({
  store: {
    getState: () => ({}),
    dispatch: jest.fn(),
    subscribe: jest.fn(),
    replaceReducer: jest.fn(),
  },
}));

const mockChangeLanguage = jest.fn();
const mockUseTranslation = jest.fn();

jest.mock('react-i18next', () => ({
  useTranslation: () => mockUseTranslation(),
  initReactI18next: {
    type: '3rdParty',
    init: jest.fn(),
  },
}));

jest.mock('../i18n', () => ({}));

describe('App Component', () => {
  const mockI18n = {
    language: 'en',
    dir: jest.fn(() => 'ltr'),
    changeLanguage: mockChangeLanguage,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseTranslation.mockReturnValue({
      i18n: mockI18n,
      t: (key: string) => key,
    });

    Object.defineProperty(document, 'documentElement', {
      value: {
        dir: '',
        lang: '',
      },
      writable: true,
    });
  });

  describe('Component Rendering', () => {
    it('should render without crashing', () => {
      render(<App />);
      const layout = screen.getByTestId('mock-layout');
      expect(layout).toBeInTheDocument();
      expect(layout).toHaveTextContent('Layout Component');
    });
  });

  describe('Language Direction Setup', () => {
    it('should set document direction and language on mount for LTR', () => {
      mockI18n.language = 'en';
      mockI18n.dir.mockReturnValue('ltr');
      
      render(<App />);
      
      expect(mockI18n.dir).toHaveBeenCalled();
      expect(document.documentElement.dir).toBe('ltr');
      expect(document.documentElement.lang).toBe('en');
    });

    it('should set document direction and language on mount for RTL', () => {
      mockI18n.language = 'ar';
      mockI18n.dir.mockReturnValue('rtl');
      
      render(<App />);
      
      expect(mockI18n.dir).toHaveBeenCalled();
      expect(document.documentElement.dir).toBe('rtl');
      expect(document.documentElement.lang).toBe('ar');
    });

    it('should update document attributes when language changes', () => {
      mockI18n.language = 'en';
      mockI18n.dir.mockReturnValue('ltr');
      
      const { rerender } = render(<App />);
      
      expect(document.documentElement.dir).toBe('ltr');
      expect(document.documentElement.lang).toBe('en');
      
      mockI18n.language = 'ar';
      mockI18n.dir.mockReturnValue('rtl');
      
      act(() => {
        rerender(<App />);
      });
      
      expect(document.documentElement.dir).toBe('rtl');
      expect(document.documentElement.lang).toBe('ar');
    });
  });


  describe('i18n Integration', () => {
    it('should use translation hook', () => {
      render(<App />);
      
      expect(mockUseTranslation).toHaveBeenCalled();
    });

    it('should call i18n.dir() to get text direction', () => {
      render(<App />);
      
      expect(mockI18n.dir).toHaveBeenCalled();
    });
  });
});