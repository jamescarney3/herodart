interface RadioGroupProps {
  legend: string;
  name: string;
  value: string;
  options: Array<{ label: string; value: string }>;
  onChange: (value: string) => void;
}

const RadioGroup = ({ legend, name, value, options, onChange }: RadioGroupProps) => (
  <fieldset className="flex flex-col gap-2">
    <legend className="text-lg font-semibold">{legend}</legend>
    {/* set these here for targeting specific enough to override regular button styles */}
    <div className="flex flex-wrap [&>label]:rounded-none first:[&>label]:rounded-l-lg last:[&>label]:rounded-r-lg">
      {options.map((option) => (
        <label key={option.value} className={`btn ${value === option.value ? 'btn-info' : ''}`}>
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange(e.target.value)}
            className="hidden"
          />
          {option.label}
        </label>
      ))}
    </div>
  </fieldset>
);

export default RadioGroup;
export type { RadioGroupProps };
