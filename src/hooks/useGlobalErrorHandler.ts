import { useEffect } from 'react';


export function useGlobalErrorHandler(onError?: (error: Error) => void) {
    useEffect(() => {
        const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
            event.preventDefault();

            const error = event.reason instanceof Error 
                ? event.reason 
                : new Error(String(event.reason));

            const errorDetails = {
                type: 'Unhandled Promise Rejection',
                message: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString(),
                url: window.location.href,
            };

            if (import.meta.env.DEV) {
                console.error('Unhandled Promise Rejection:', errorDetails);
            }

            if (onError) {
                onError(error);
            }
        };

        const handleGlobalError = (event: ErrorEvent) => {
            event.preventDefault();

            const error = event.error instanceof Error 
                ? event.error 
                : new Error(event.message);

            const errorDetails = {
                type: 'Global Error',
                message: error.message,
                stack: error.stack,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                timestamp: new Date().toISOString(),
                url: window.location.href,
            };

            if (import.meta.env.DEV) {
                console.error('Global Error:', errorDetails);
            }
        };

        window.addEventListener('unhandledrejection', handleUnhandledRejection);
        window.addEventListener('error', handleGlobalError);

        return () => {
            window.removeEventListener('unhandledrejection', handleUnhandledRejection);
            window.removeEventListener('error', handleGlobalError);
        };
    }, [onError]);
}
