import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';


interface IncomeFieldProps<T extends FieldValues> {
  currencyName: Path<T>;
  incomeName: Path<T>;
  label: string;
  error?: boolean;
  helperText?: string;
  control: Control<T>;
  currencies: { value: string; symbol: string }[];
}

const IncomeField = <T extends FieldValues>({ 
  currencyName,
  incomeName,
  label, 
  error, 
  helperText,
  control,
  currencies
}: IncomeFieldProps<T>) => (
  <div className="field-container">
    <label className="field-label">{label}</label>
    <div className="flex gap-2">
      <Controller
        name={currencyName}
        control={control}
        render={({ field }) => (
          <select
            {...field}
            value={field.value || ''}
            className={error ? 'select-error w-28' : 'select-default w-28'}
          >
            <option value="">Currency</option>
            {currencies.map(currency => (
              <option key={currency.value} value={currency.value}>
                {currency.symbol}
              </option>
            ))}
          </select>
        )}
      />
      <Controller
        name={incomeName}
        control={control}
        render={({ field }) => (
          <input
            {...field}
            value={field.value || ''}
            onChange={(e) => {
              const value = e.target.value;
              field.onChange(value === '' ? null : Number(value));
            }}
            type="number"
            min={0}
            step={1}
            placeholder="Monthly income"
            className={`${error ? 'input-error flex-1' : 'input-default flex-1'} no-spinner`}
          />
        )}
      />
    </div>
    {error && helperText && (
      <p className="field-error">{helperText}</p>
    )}
  </div>
);

export default IncomeField;