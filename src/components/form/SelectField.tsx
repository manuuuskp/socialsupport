import { useController, type Control, type FieldValues, type Path } from 'react-hook-form';

interface SelectFieldProps<T extends FieldValues> {
  name: Path<T>;
  placeholder: string;
  label: string;
  options: { value: string; label: string }[];
  error?: boolean;
  helperText?: string;
  control: Control<T>;
}

const SelectField = <T extends FieldValues>({ 
  name, 
  placeholder, 
  label, 
  options, 
  error, 
  helperText,
  control
}: SelectFieldProps<T>) => {
  const { field } = useController({
    name,
    control,
  });

  return (
    <div className="field-container">
      <label htmlFor={name} className="field-label">
        {label}
      </label>
      <select
        {...field}
        value={field.value || ''}
        id={name}
        className={error ? 'select-error' : 'select-default'}
        aria-describedby={error ? `${name}-error` : undefined}
      >
        <option value="">{placeholder}</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && helperText && (
        <p id={`${name}-error`} className="field-error">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default SelectField;