import { useController, type Control } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from "yup";
import { situtationFormSchema } from '../socialsupportform/situationInfo/situationFormSchema';

type SituationFormData = yup.InferType<typeof situtationFormSchema>;

interface Props {
    name: keyof SituationFormData;
    label: string;
    placeholder: string;
    helpText: string;
    rows?: number;
    control: Control<SituationFormData>;
    onAIHelp: (fieldKey: string) => void;
    error?: any;
    isValid?: boolean;
}

const TextAreaFieldWithAI = ({ name, label, placeholder, helpText, rows = 4, control, onAIHelp, error, isValid = false }: Props) => {
    const { t } = useTranslation();
    const { field } = useController({
        name,
        control,
    });

    return (
        <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
                <label htmlFor={name} className="font-medium">{label}</label>
                <button 
                    type="button" 
                    onClick={() => onAIHelp(name)} 
                    disabled={!isValid}
                    className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all border ${
                        isValid 
                            ? 'border-blue-500 text-blue-600 hover:bg-blue-50 cursor-pointer' 
                            : 'border-gray-300 text-gray-400 cursor-not-allowed'
                    }`}
                >
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-3 w-3" 
                        viewBox="0 0 24 24" 
                        fill="currentColor"
                    >
                        <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 22.5l-.394-1.933a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                    </svg>
                    {t('buttons.aiHelper')}
                </button>
            </div>

            <textarea
                {...field}
                id={name}
                rows={rows}
                placeholder={placeholder}
                className={`w-full p-2 border rounded-md ${error ? 'border-red-500' : 'border-gray-300'}`}
            />

            {error && <span className="text-red-500 text-sm">{error}</span>}
            <p className="text-gray-500 text-sm">{helpText}</p>
        </div>
    );
};

export default TextAreaFieldWithAI;
