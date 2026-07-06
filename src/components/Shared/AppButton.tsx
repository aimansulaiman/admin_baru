type AppButtonProps = {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "outline" | "danger";
  disabled?: boolean;
  onClick?: () => void;
};

const AppButton = ({
  children,
  type = "button",
  variant = "primary",
  disabled = false,
  onClick,
}: AppButtonProps) => {
  const baseClass =
    "rounded-lg px-5 py-3 font-medium transition disabled:opacity-60";

  const variantClass = {
    primary: "bg-primary text-white hover:bg-primary/90",
    outline:
      "border border-stroke text-dark hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-dark-2",
    danger: "text-red hover:text-red/80",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseClass} ${variantClass[variant]}`}
    >
      {children}
    </button>
  );
};

export default AppButton;