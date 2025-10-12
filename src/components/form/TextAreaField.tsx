import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';


interface TextAreaFieldProps<T extends FieldValues> {
  name: Path<T>;
  placeholder: string;
  label: string;
  rows?: number;
  error?: any;
  helperText?: string;
  control: Control<T>;
}

const TextAreaField = <T extends FieldValues>({
  name,
  placeholder,
  label,
  helperText,
  rows = 2,
  error,
  control
}: TextAreaFieldProps<T>) => {

  return (
    <div className="field-container">
      <label htmlFor={name} className="field-label">
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <textarea
            {...field}
            value={field.value || ''}
            id={name}
            rows={rows}
            placeholder={placeholder}
            className="textarea-default"
          />
        )}
      />

      {error && helperText && (
        <p id={`${name}-error`} className="field-error">
          {helperText}
        </p>
      )}
    </div>
  )
};

export default TextAreaField;