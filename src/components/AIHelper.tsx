import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useOpenAI } from '../hooks/useOpenAI';
import { type OpenAIRequest } from '../types/types';
import ModalWrapper from './ModalWrapper';

interface AIHelperProps {
  open: boolean;
  onClose: () => void;
  onAccept: (text: string) => void;
  fieldKey: string;
  contextText: string;
  userPrompt?: string;
  setUserPrompt?: (prompt: string) => void;
  tone?: string;
  length?: string;
}

const AIHelper = ({
  open,
  onClose,
  onAccept,
  fieldKey,
  contextText,
  userPrompt = '',
  setUserPrompt = () => { },
  tone = 'professional',
  length = 'medium',
}: AIHelperProps) => {
  const { t, i18n } = useTranslation();
  const { data, error, loading, request, reset } = useOpenAI();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [editedText, setEditedText] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (open) {
      setEditedText('');
      setIsEditing(false);
      reset();
      handleGenerate();
      if (textareaRef.current) {
        textareaRef.current.focus();
        const length = textareaRef.current.value.length;
        textareaRef.current.setSelectionRange(length, length);
      }
    }
  }, [open, fieldKey]);

  const handleGenerate = async () => {
    const requestParams: OpenAIRequest = {
      fieldKey,
      contextText,
      tone,
      length,
      userPrompt: userPrompt || undefined,
      language: i18n.language,
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
    setEditedText('');
    setIsEditing(false);
    reset();
    onClose();
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedText(data || '');
  };

  if (!open) return null;

  return (
    <ModalWrapper title={t('form.step3.aiModal.title')} description={t('form.step3.aiModal.description')}>

      <div className="p-4 flex flex-col gap-3">
        <textarea
          ref={textareaRef}
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          placeholder={t('form.step3.aiModal.describeYourSituation')}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          name="aiHelper"
        />

        <button
          onClick={handleGenerate}
          disabled={loading || userPrompt.trim().length < 15}
          className="self-start btn-primary disabled:bg-gray-300"
        >
          {t('form.step3.aiModal.regenerate')}
        </button>

        {loading && <p className="text-gray-600 text-sm">{t('form.step3.aiModal.generating')}</p>}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-2 text-red-700 text-sm">
            <p>{t('form.step3.aiModal.error')}</p>
            <p>{error}</p>
            <button onClick={handleGenerate} className="underline mt-1 text-red-600">
              {t('form.step3.aiModal.tryAgain')}
            </button>
          </div>
        )}
      </div>

      {data && !loading && (
        <div className="p-4">
          {isEditing ? (
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              autoFocus
            />
          ) : (
            <div className="h-[250px] overflow-auto sm:h-auto p-3 bg-gray-50 border rounded text-gray-900 whitespace-pre-wrap">
              {data}
            </div>
          )}
        </div>
      )}

      <div className="p-4 border-t flex flex-col sm:flex-row-reverse gap-2">
        {data && !loading && !isEditing && (
          <>
            <button
              onClick={handleAccept}
              className="btn-primary"
            >
              {t('form.step3.aiModal.accept')}
            </button>
            <button
              onClick={handleEdit}
              className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              {t('form.step3.aiModal.edit')}
            </button>
          </>
        )}

        {isEditing && (
          <button
            onClick={handleAccept}
            disabled={!editedText.trim()}
            className="btn-primary disabled:bg-gray-300"
          >
            {t('form.step3.aiModal.accept')}
          </button>
        )}

        <button
          onClick={handleClose}
          className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
        >
          {t('form.step3.aiModal.cancel')}
        </button>
      </div>
    </ModalWrapper>
  );
};

export default AIHelper;
