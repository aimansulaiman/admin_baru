type AppStatusBadgeProps = {
  children: React.ReactNode;
  variant?: "primary" | "danger" | "success";
};

const AppStatusBadge = ({
  children,
  variant = "primary",
}: AppStatusBadgeProps) => {
  const variantClass = {
    primary: "bg-primary/10 text-primary",
    danger: "bg-red-light-6 text-red",
    success: "bg-green-light-6 text-green",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-sm font-medium ${variantClass[variant]}`}
    >
      {children}
    </span>
  );
};

export default AppStatusBadge;