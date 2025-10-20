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
                    className={`text-sm ${isValid ? 'text-blue-600 hover:underline cursor-pointer' : 'text-gray-400 cursor-not-allowed'}`}
                >
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
