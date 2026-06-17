import ForgotPassword from "@/components/Auth/ForgotPassword";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Forgot Password Page",
};

export default function ForgotPasswordPage() {
  return (
    <main className="rounded-[10px] bg-white dark:bg-gray-dark">
      <div className="flex h-svh flex-wrap items-center">
        <div className="w-full xl:w-1/2">
          <div className="mx-auto px-8 sm:w-1/2">
            <ForgotPassword />
          </div>
        </div>

        <div className="hidden w-full p-7.5 xl:block xl:w-1/2">
          <div className="custom-gradient-1 relative h-full min-h-170 overflow-hidden rounded-2xl px-12.5 pt-12.5 dark:bg-dark-2! dark:bg-none">
            <Link className="mb-10 inline-block" href="/">
              <Image
                className="hidden dark:block"
                src={"/images/logo/logo.svg"}
                alt="Logo"
                width={176}
                height={32}
              />
              <Image
                className="dark:hidden"
                src={"/images/logo/logo-dark.svg"}
                alt="Logo"
                width={176}
                height={32}
              />
            </Link>
            <p className="mb-3 text-xl font-medium text-dark dark:text-white">
              Forget your password?
            </p>

            <h1 className="mb-4 text-2xl font-bold text-dark sm:text-heading-3 dark:text-white">
              Reset Password!
            </h1>

            <p className="w-full max-w-93.75 font-medium text-dark-4 dark:text-dark-6">
              Enter your email address to receive a password reset link.
            </p>

            <div className="absolute bottom-0 left-1/2 -translate-1/2">
              <Image
                src={"/images/grids/grid-02.svg"}
                alt="Logo"
                width={292}
                height={234}
                className="mx-auto dark:opacity-30"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
