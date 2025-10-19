import { createContext, useState, useContext } from 'react';

interface GlobalErrorContextType {
    error: string | null;
    setGlobalError: (msg: string | null) => void;
}

const GlobalErrorContext = createContext<GlobalErrorContextType>({
    error: null,
    setGlobalError: (msg: string | null) => { },
});

export const GlobalErrorProvider = ({ children }: { children: React.ReactNode }) => {
    const [error, setGlobalError] = useState<string | null>(null);
    return (
        <GlobalErrorContext.Provider value={{ error, setGlobalError }}>
            {children}
            {error && (
                <div className="fixed bottom-4 right-4 bg-red-500 text-white p-3 rounded shadow-lg">
                    {error}
                </div>
            )}
        </GlobalErrorContext.Provider>
    );
};

export const useGlobalError = () => useContext(GlobalErrorContext);
