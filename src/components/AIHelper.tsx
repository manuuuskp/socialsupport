import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useOpenAI } from '../hooks/useOpenAI';
import { type OpenAIRequest } from '../types';

interface AIHelperProps {
  open: boolean;
  onClose: () => void;
  onAccept: (text: string) => void;
  fieldKey: string;
  contextText: string;
  tone?: string;
  length?: string;
}

const AIHelper = ({
  open,
  onClose,
  onAccept,
  fieldKey,
  contextText,
  tone = 'professional',
  length = 'medium',
}: AIHelperProps) => {
  const { t } = useTranslation();
  const { data, error, loading, request } = useOpenAI();
  const [editedText, setEditedText] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (open && !data && !loading && !error) {
      handleGenerate();
    }
  }, [open]);

  useEffect(() => {
    if (data) {
      setEditedText(data);
    }
  }, [data]);

  const handleGenerate = async () => {
    const requestParams: OpenAIRequest = {
      fieldKey,
      contextText,
      tone,
      length,
    };
    await request(requestParams);
  };

  const handleAccept = () => {
    const textToAccept = isEditing ? editedText : data;
    if (textToAccept) {
      onAccept(textToAccept);
      handleClose();
    }
  };

  const handleClose = () => {
    setIsEditing(false);
    setEditedText('');
    onClose();
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedText(data || '');
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={handleClose}
        />

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="ai-modal-title">
                  {t('form.step3.aiModal.title')}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    {t('form.step3.aiModal.description')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 sm:px-6">
            {loading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="ml-4 text-gray-600">
                  {t('form.step3.aiModal.generating')}
                </p>
              </div>
            )}

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800">
                      {t('form.step3.aiModal.error')}
                    </p>
                    <button
                      onClick={handleGenerate}
                      className="mt-2 text-sm text-red-600 hover:text-red-500 underline"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              </div>
            )}

            {data && !loading && (
              <div className="mt-4">
                {isEditing ? (
                  <textarea
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    autoFocus
                    aria-label="Edit AI suggestion"
                  />
                ) : (
                  <div className="p-4 bg-gray-50 rounded-lg border">
                    <p className="whitespace-pre-wrap text-gray-900">
                      {data}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            {data && !loading && !isEditing && (
              <>
                <button
                  onClick={handleAccept}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {t('form.step3.aiModal.accept')}
                </button>
                <button
                  onClick={handleEdit}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {t('form.step3.aiModal.edit')}
                </button>
              </>
            )}

            {isEditing && (
              <button
                onClick={handleAccept}
                disabled={!editedText.trim()}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed sm:ml-3 sm:w-auto sm:text-sm"
              >
                {t('form.step3.aiModal.accept')}
              </button>
            )}

            <button
              onClick={handleClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
            >
              {t('form.step3.aiModal.cancel')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIHelper;