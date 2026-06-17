import { type HTMLInputTypeAttribute, useId } from "react";

type InputGroupProps = {
  className?: string;
  label: string;
  placeholder: string;
  type: HTMLInputTypeAttribute;
  error?: string;
  fileStyleVariant?: "style1" | "style2";
  required?: boolean;
  disabled?: boolean;
  active?: boolean;
  handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  name?: string;
  icon?: React.ReactNode;
} & Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  | "className"
  | "type"
  | "placeholder"
  | "required"
  | "disabled"
  | "name"
  | "value"
  | "onChange"
>;

const InputGroup: React.FC<InputGroupProps> = ({
  className,
  label,
  type,
  placeholder,
  error,
  required,
  disabled,
  active,
  handleChange,
  icon,
  ...props
}) => {
  const id = useId();
  const errorId = `${id}-error`;
  const describedBy = [props["aria-describedby"], error ? errorId : undefined]
    .filter(Boolean)
    .join(" ") || undefined;

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="text-body-sm font-medium text-dark dark:text-white"
      >
        {label}
        {required && <span className="ml-1 text-red select-none">*</span>}
      </label>

      <div className="relative mt-3 [&_svg]:absolute [&_svg]:top-1/2 [&_svg]:right-4.5 [&_svg]:-translate-y-1/2">
        <input
          id={id}
          type={type}
          name={props.name}
          placeholder={placeholder}
          onChange={handleChange}
          value={props.value}
          autoComplete={props.autoComplete}
          aria-invalid={Boolean(props["aria-invalid"] || error)}
          aria-describedby={describedBy}
          autoCapitalize={props.autoCapitalize}
          autoCorrect={props.autoCorrect}
          className={
            "w-full rounded-lg border-[1.5px] border-stroke bg-transparent transition outline-none focus:border-primary disabled:cursor-default disabled:bg-gray-2 data-[active=true]:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary dark:disabled:bg-dark dark:data-[active=true]:border-primary" +
            (type === "file"
              ? ` ${getFileStyles(props.fileStyleVariant!)}`
              : " px-5.5 py-3 text-dark placeholder:text-dark-6 dark:text-white")
          }
          required={required}
          disabled={disabled}
          data-active={active}
        />

        {icon}
      </div>

      {error && (
        <p id={errorId} className="mt-2 text-sm text-red">
          {error}
        </p>
      )}
    </div>
  );
};

export default InputGroup;

function getFileStyles(variant: "style1" | "style2") {
  switch (variant) {
    case "style1":
      return `file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-[#E2E8F0] file:px-6.5 file:py-[13px] file:text-body-sm file:font-medium file:text-dark-5 file:hover:bg-primary file:hover:bg-opacity-10 dark:file:border-dark-3 dark:file:bg-white/30 dark:file:text-white`;
    default:
      return `file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-stroke file:px-2.5 file:py-1 file:text-body-xs file:font-medium file:text-dark-5 file:focus:border-primary dark:file:border-dark-3 dark:file:bg-white/30 dark:file:text-white px-3 py-[9px]`;
  }
}
