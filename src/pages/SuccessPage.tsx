import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';

const SuccessPage = () => {
    const { t } = useTranslation();
    const { applicationId } = useParams<{ applicationId: string }>();
    const navigate = useNavigate();

    const handleNavigateToForm = () => {
        navigate('/');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                        <svg
                            className="h-8 w-8 text-green-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>

                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        {t('success.title')}
                    </h2>

                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm font-medium text-blue-900 mb-1">
                            {t('success.applicationId')}
                        </p>
                        <p className="text-lg font-mono font-bold text-blue-700">
                            {applicationId}
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                            {t('success.saveId')}
                        </p>
                    </div>

                    <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg text-left">
                        <h3 className="text-sm font-medium text-gray-900 mb-2">
                            {t('success.nextSteps')}
                        </h3>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>{t('success.step1')}</li>
                            <li>{t('success.step2')}</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 space-y-3">
                    <button
                        type="button"
                        onClick={handleNavigateToForm}
                        className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                        {t('success.newApplication')}
                    </button>

                    <button
                        type="button"
                        onClick={() => window.print()}
                        className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                        {t('success.print')}
                    </button>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500">
                        {t('success.contact')}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SuccessPage;