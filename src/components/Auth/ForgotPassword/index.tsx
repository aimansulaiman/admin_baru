"use client";

import { EmailIcon } from "@/assets/icons";
import InputGroup from "@/components/FormElements/InputGroup";
import { authClient } from "@/lib/auth/auth-client";
import validateEmail from "@/utils/validateEmail";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address.");

      return;
    }

    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await authClient.requestPasswordReset({
        email,
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
      });

      if (error || !data?.status) {
        toast.error(error?.message ?? "Something went wrong");
        return;
      }

      router.push("/auth/sign-in");
      toast.success(data.message || "Password reset link sent to your email.");
      setEmail("");
    } catch (error: any) {
      toast.error(error?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <InputGroup
          type="email"
          label="Email"
          placeholder="Enter your email"
          className="mb-6"
          name="email"
          value={email}
          handleChange={handleChange}
          icon={<EmailIcon />}
          required
        />

        <div className="mb-4.5">
          <button
            type="submit"
            disabled={loading}
            className="hover:bg-opacity-90 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-80"
          >
            {loading ? (
              <>
                Sending
                <span
                  className={`inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent dark:border-dark dark:border-t-transparent`}
                ></span>
              </>
            ) : (
              "Send Password Reset Link"
            )}
          </button>
        </div>

        <div className="text-center font-medium">
          <p>
            Login to your account from{" "}
            <Link href="/auth/sign-in" className="text-primary underline">
              here
            </Link>
          </p>
        </div>
      </form>
    </>
  );
}
