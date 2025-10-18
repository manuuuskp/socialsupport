import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';
import { withTranslation, type WithTranslation } from 'react-i18next';

interface Props extends WithTranslation {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
    errorCount: number;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            errorCount: 0,
        };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        return {
            hasError: true,
            error,
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        this.logErrorToService(error, errorInfo);

        this.setState((prevState) => ({
            errorInfo,
            errorCount: prevState.errorCount + 1,
        }));

        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }
    }

    logErrorToService(error: Error, errorInfo: ErrorInfo): void {
        const errorDetails = {
            message: error.message,
            stack: error.stack,
            componentStack: errorInfo.componentStack,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href,
        };

        if (import.meta.env.DEV) {
            console.error('Error Boundary caught an error:', errorDetails);
        }
    }

    handleReset = (): void => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });

        window.location.reload();
    };

    handleGoHome = (): void => {
        window.location.href = '/';
    };

    render(): ReactNode {
        const { t } = this.props;
        if (this.state.hasError) {

            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-md w-full space-y-8">
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                                <svg
                                    className="h-8 w-8 text-red-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                    />
                                </svg>
                            </div>

                            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
                                {t('error.message')}
                            </h1>

                            <p className="text-base text-gray-600 mb-6">
                                {t('error.description')}
                            </p>

                            {this.state.errorCount > 2 && (
                                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <p className="text-sm text-yellow-800">
                                        {t('error.clearCache')}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="space-y-3">
                            <button
                                type="button"
                                onClick={this.handleReset}
                                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            >
                                {t('error.tryAgain')}
                            </button>

                            <button
                                type="button"
                                onClick={this.handleGoHome}
                                className="w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            >
                                {t('error.goHome')}
                            </button>
                        </div>

                        <div className="mt-6 text-center">
                            <p className="text-xs text-gray-500">
                                {t('error.contactSupport')}
                            </p>
                            {import.meta.env.DEV && (
                                <p className="text-xs text-gray-400 mt-2">
                                    Error ID: {new Date().getTime()}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default withTranslation()(ErrorBoundary);
