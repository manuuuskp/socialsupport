import { useController, type Control, type FieldValues, type Path } from 'react-hook-form';

interface PhoneFieldProps<T extends FieldValues> {
  countryCodeName: Path<T>;
  phoneName: Path<T>;
  label: string;
  error?: boolean;
  helperText?: string;
  control: Control<T>;
  countryCodes: { value: string; label: string }[];
}

const PhoneField = <T extends FieldValues>({
  countryCodeName,
  phoneName,
  label,
  error,
  helperText,
  control,
  countryCodes
}: PhoneFieldProps<T>) => {
  const { field: countryCodeField } = useController({
    name: countryCodeName,
    control,
  });

  const { field: phoneField } = useController({
    name: phoneName,
    control,
  });

  return (
    <div className="field-container">
      <label className="field-label">{label}</label>
      <div className="flex gap-2">
        <select
          {...countryCodeField}
          value={countryCodeField.value || ''}
          className={error ? 'select-error w-32' : 'select-default w-32'}
        >
          <option value="">Code</option>
          {countryCodes.map(code => (
            <option key={code.value} value={code.value}>
              {code.label}
            </option>
          ))}
        </select>
        <input
          {...phoneField}
          value={phoneField.value || ''}
          onChange={(e) => {
            const value = e.target.value;
            phoneField.onChange(value === '' ? null : Number(value));
          }}
          onKeyDown={(e) => {
            if (e.key === '.' || e.key === ',') e.preventDefault();
          }}
          type="number"
          placeholder="Phone number"
          className={`${error ? 'input-error flex-1' : 'input-default flex-1'} no-spinner`}
          min={1}
        />
      </div>
      {error && helperText && (
        <p className="field-error">{helperText}</p>
      )}
    </div>
  );
};

export default PhoneField;