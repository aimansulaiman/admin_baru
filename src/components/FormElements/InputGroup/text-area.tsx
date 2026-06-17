import { cn } from "@/lib/utils";
import { useId } from "react";

interface PropsType
  extends Omit<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    | "className"
    | "placeholder"
    | "required"
    | "disabled"
    | "name"
    | "rows"
    | "defaultValue"
    | "value"
    | "onChange"
  > {
  label: string;
  placeholder: string;
  required?: boolean;
  disabled?: boolean;
  active?: boolean;
  className?: string;
  icon?: React.ReactNode;
  error?: string;
  defaultValue?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  name?: string;
  rows?: number;
}

export function TextAreaGroup({
  label,
  placeholder,
  required,
  disabled,
  active,
  className,
  icon,
  error,
  defaultValue,
  value,
  onChange,
  name,
  rows = 6,
  ...props
}: PropsType) {
  const id = useId();
  const errorId = `${id}-error`;
  const describedBy = [props["aria-describedby"], error ? errorId : undefined]
    .filter(Boolean)
    .join(" ") || undefined;

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-3 block text-body-sm font-medium text-dark dark:text-white"
      >
        {label}
      </label>

      <div className="relative mt-3 [&_svg]:pointer-events-none [&_svg]:absolute [&_svg]:left-5.5 [&_svg]:top-5.5">
        <textarea
          id={id}
          name={name}
          rows={rows}
          placeholder={placeholder}
          defaultValue={value === undefined ? defaultValue : undefined}
          value={value}
          onChange={onChange}
          {...props}
          aria-invalid={Boolean(props["aria-invalid"] || error)}
          aria-describedby={describedBy}
          className={cn(
            "w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary disabled:cursor-default disabled:bg-gray-2 data-[active=true]:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary dark:disabled:bg-dark dark:data-[active=true]:border-primary",
            icon && "py-5 pl-13 pr-5",
          )}
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
}
