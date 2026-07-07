"use client";

import { authClient } from "@/lib/auth/auth-client";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  type ChangeEvent,
  type ClipboardEvent,
  type KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";

const OTP_LENGTH = 6;

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [otp, setOtp] = useState(Array.from({ length: OTP_LENGTH }, () => ""));
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const code = useMemo(() => otp.join(""), [otp]);
  const isComplete = code.length === OTP_LENGTH && otp.every((value) => value);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const updateDigit = (index: number, value: string) => {
    const nextValue = value.replace(/\D/g, "").slice(-1);

    setOtp((current) => {
      const next = [...current];
      next[index] = nextValue;
      return next;
    });

    if (nextValue && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleChange =
    (index: number) => (event: ChangeEvent<HTMLInputElement>) => {
      updateDigit(index, event.target.value);
    };

  const handleKeyDown =
    (index: number) => (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Backspace" && !otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    };

  const handlePaste = (event: ClipboardEvent<HTMLDivElement>) => {
    event.preventDefault();

    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    if (!pasted) return;

    const nextOtp = Array.from(
      { length: OTP_LENGTH },
      (_, index) => pasted[index] ?? "",
    );

    setOtp(nextOtp);

    const nextIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerify = async () => {
    if (!email) {
      toast.error("Missing email address. Please sign up again.");
      return;
    }

    if (!isComplete) {
      toast.error("Enter the 6-digit verification code.");
      return;
    }

    setIsVerifying(true);

    try {
      const { error } = await authClient.emailOtp.verifyEmail({
        email,
        otp: code,
      });

      if (error) {
        toast.error(error.message ?? "Unable to verify your account.");
        return;
      }

      toast.success("Your email has been verified.");
      router.replace("/auth/sign-in");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error("Missing email address. Please sign up again.");
      return;
    }

    setIsResending(true);

    try {
      const { error } = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "email-verification",
      });

      if (error) {
        toast.error(error.message ?? "Unable to resend verification code.");
        return;
      }

      toast.success("A new verification code has been sent.");
      setOtp(Array.from({ length: OTP_LENGTH }, () => ""));
      inputRefs.current[0]?.focus();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="overflow-hidden bg-gray-4 px-4 sm:px-8 dark:bg-dark-2">
      <div className="flex min-h-svh flex-col items-center justify-center overflow-hidden">
        <div className="no-scrollbar w-full overflow-y-auto">
          <div className="mx-auto w-full sm:max-w-1/2">
            <div className="rounded-2xl border border-stroke bg-white p-5 shadow-card-10 lg:p-8 dark:border-dark-3 dark:bg-gray-dark">
              <Link href="/" className="mx-auto mb-8 block w-fit">
                <Image
                  width={176}
                  height={32}
                  src="/images/logo/logo-dark.svg"
                  alt="Logo"
                  priority
                  className="dark:hidden"
                />
                <Image
                  width={176}
                  height={32}
                  src="/images/logo/logo.svg"
                  alt="Logo"
                  priority
                  className="hidden dark:block"
                />
              </Link>

              <div className="text-center">
                <p className="mb-2 text-sm font-semibold tracking-[0.25em] text-primary uppercase">
                  Email verification
                </p>
                <h1 className="mb-3 text-3xl leading-12 font-black text-dark dark:text-white">
                  Verify your account
                </h1>
                <p className="mx-auto mb-8 max-w-md font-medium text-dark-4 dark:text-dark-6">
                  Enter the 6-digit code we sent{email ? ` to ${email}` : ""}.
                </p>
              </div>

              <div className="space-y-6" onPaste={handlePaste}>
                <div className="flex gap-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(node) => {
                        inputRefs.current[index] = node;
                      }}
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={1}
                      value={digit}
                      onChange={handleChange(index)}
                      onKeyDown={handleKeyDown(index)}
                      className="h-14 w-full rounded-xl border border-stroke bg-transparent text-center text-2xl font-semibold text-dark transition outline-none focus:border-primary dark:border-dark-3 dark:text-white"
                      aria-label={`Digit ${index + 1}`}
                    />
                  ))}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleVerify}
                    disabled={isVerifying || !isComplete}
                    className="hover:bg-opacity-90 inline-flex w-full items-center justify-center rounded-xl bg-primary px-5 py-3.5 font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isVerifying ? "Verifying..." : "Verify email"}
                  </button>

                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={isResending || !email}
                    className="inline-flex w-full items-center justify-center rounded-xl border border-stroke px-5 py-3.5 font-bold text-dark transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-60 dark:border-dark-3 dark:text-white"
                  >
                    {isResending ? "Sending..." : "Resend code"}
                  </button>
                </div>

                <p className="text-center text-sm font-medium text-dark-4 dark:text-dark-6">
                  Didn&apos;t receive a code? Check spam or resend a new one.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}