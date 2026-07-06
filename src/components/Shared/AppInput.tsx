type AppInputProps = {
  label: string;
  value: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  onChange: (value: string) => void;
};

const AppInput = ({
  label,
  value,
  type = "text",
  required = false,
  placeholder = "",
  onChange,
}: AppInputProps) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
        {label}
      </label>

      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
      />
    </div>
  );
};

export default AppInput;