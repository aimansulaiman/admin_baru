"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";

type PropsType = {
  toast_type?: string;
  message?: string;
};

export default function NotifyUser({ toast_type, message }: PropsType) {
  useEffect(() => {
    if (toast_type && message) {
      if (toast_type === "success") {
        toast.success(message);
      } else {
        toast.error(message);
      }
    }
  }, []);

  return null;
}
