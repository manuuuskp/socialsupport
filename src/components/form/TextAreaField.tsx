import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';


interface TextAreaFieldProps<T extends FieldValues> {
  name: Path<T>;
  placeholder: string;
  label: string;
  rows?: number;
  control: Control<T>;
}

const TextAreaField = <T extends FieldValues> ({ 
  name, 
  placeholder, 
  label, 
  rows = 2,
  control
}: TextAreaFieldProps<T>) => (
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
  </div>
);

export default TextAreaField;