type SelectOption = {
  label: string;
  value: string;
};

type AppSelectProps = {
  label: string;
  value: string;
  options: SelectOption[];
  required?: boolean;
  onChange: (value: string) => void;
};

const AppSelect = ({
  label,
  value,
  options,
  required = false,
  onChange,
}: AppSelectProps) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
        {label}
      </label>

      <select
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
      >
        {options.map((option) => (
          <option key={option.value || option.label} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default AppSelect;