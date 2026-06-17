import { type PropsWithChildren } from "react";
import ToastContext from "../../context/ToastContext";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      {children}
      <ToastContext />
    </>
  );
}
