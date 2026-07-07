import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type TableActionVariant = "primary" | "danger" | "outline";

type BaseProps = {
  children: ReactNode;
  variant?: TableActionVariant;
  className?: string;
};

type TableActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  BaseProps;

type TableActionLinkProps = BaseProps & {
  href: string;
};

const variantClass = {
  primary: "bg-primary text-white hover:bg-opacity-90",
  danger: "bg-red text-white hover:bg-opacity-90",
  outline:
    "border border-stroke text-dark hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-dark-2",
};

export const TableActionButton = ({
  children,
  variant = "primary",
  className = "",
  ...props
}: TableActionButtonProps) => {
  return (
    <button
      type="button"
      className={`rounded-lg px-3 py-2 text-xs font-medium transition disabled:opacity-60 ${variantClass[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const TableActionLink = ({
  children,
  href,
  variant = "outline",
  className = "",
}: TableActionLinkProps) => {
  return (
    <Link
      href={href}
      className={`rounded-lg px-3 py-2 text-xs font-medium transition ${variantClass[variant]} ${className}`}
    >
      {children}
    </Link>
  );
};