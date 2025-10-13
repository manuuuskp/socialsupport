import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';

interface InputFieldProps<T extends FieldValues> {
  name: Path<T>;
  type?: string;
  placeholder: string;
  label: string;
  error?: boolean;
  helperText?: string;
  min?: number;
  step?: number;
  control: Control<T>;
}

const InputField = <T extends FieldValues>({
  name,
  type = 'text',
  placeholder,
  label,
  error,
  helperText,
  min = 0,
  step = 1,
  control,
}: InputFieldProps<T>) => {
  return (
    <div className="field-container">
      <label htmlFor={name} className="field-label">
        {label}
      </label>

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <input
            {...field}
            id={name}
            type={type}
            value={field.value ?? ''}
            onKeyDown={(e) => {
              if (type === 'number' && (e.key === '.' || e.key === ',')) e.preventDefault();
            }}
            onChange={(e) => {
              const value = e.target.value;
              if (type === 'number') {
                field.onChange(value === '' ? null : Number(value));
              } else {
                field.onChange(value);
              }
            }}
            placeholder={placeholder}
            className={`${error ? 'input-error' : 'input-default'} ${type === 'number' ? 'no-spinner' : ''}`}
            aria-describedby={error ? `${name}-error` : undefined}
            min={type === 'number' ? min : undefined}
            step={type === 'number' ? step : undefined}
          />
        )}
      />

      {error && helperText && (
        <p id={`${name}-error`} className="field-error">
          {helperText}
        </p>
      )}
    </div>
  );
}

export default InputField;
