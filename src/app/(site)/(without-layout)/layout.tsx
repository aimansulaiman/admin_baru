import type { ReactNode } from "react";
import ToastContext from "../../context/ToastContext";

export default function WithoutLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <main className="min-h-screen bg-gray-2 dark:bg-[#020d1a]">
        {children}
      </main>

      <ToastContext />
    </>
  );
}