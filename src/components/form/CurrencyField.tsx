import { useController, type Control, type FieldValues, type Path } from 'react-hook-form';


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
}: IncomeFieldProps<T>) => {
  const { field: currencyField } = useController({
    name: currencyName,
    control,
  });

  const { field: incomeField } = useController({
    name: incomeName,
    control,
  });

  return (
    <div className="field-container">
      <label className="field-label">{label}</label>
      <div className="flex gap-2">
        <select
          {...currencyField}
          value={currencyField.value || ''}
          className={error ? 'select-error w-28' : 'select-default w-28'}
        >
          <option value="">Currency</option>
          {currencies.map(currency => (
            <option key={currency.value} value={currency.value}>
              {currency.symbol}
            </option>
          ))}
        </select>
        <input
          {...incomeField}
          value={incomeField.value || ''}
          onChange={(e) => {
            const value = e.target.value;
            incomeField.onChange(value === '' ? null : Number(value));
          }}
          type="number"
          min={0}
          step={1}
          placeholder="Monthly income"
          className={`${error ? 'input-error flex-1' : 'input-default flex-1'} no-spinner`}
        />
      </div>
      {error && helperText && (
        <p className="field-error">{helperText}</p>
      )}
    </div>
  );
};

export default IncomeField;