import MulaLogo from "@/assets/logos/MulaLogo.png";
import Signin from "@/components/Auth/Signin";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "MULA Coffee Sign In",
};

export default function SignIn() {
  return (
    <main className="min-h-svh bg-[#f5f5f5] dark:bg-[#111827]">
      <div className="flex min-h-svh items-start justify-center px-4 pt-6 pb-8">
        <div className="w-full max-w-[380px] text-center">
          <div className="mb-0 flex justify-center">
            <Image
              src={MulaLogo}
              alt="MULA Coffee Logo"
              width={180}
              height={94}
              priority
              className="h-auto"
            />
          </div>

          <div className="mb-6 text-center text-silver">
            <h1 className="text-2xl font-semibold leading-tight tracking-wide">
              MULA COFFEE
              <br />
              <span className="text-base font-semibold tracking-wider text-silver/85">
                ADMINISTRATION SYSTEM
              </span>
            </h1>
          </div>

          <div className="rounded-xl bg-white px-6 py-8 text-left shadow-xl dark:bg-[#1f2937]">
            <div className="mb-5 text-center">
              <h1 className="text-xl font-semibold text-slate-500 dark:text-slate-300">
                Welcome Back
              </h1>

              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Sign in to your account
              </p>
            </div>

            <Signin />

            <div className="mt-5 text-center">
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Don&apos;t have an account?{" "}
                <Link
                  href="/auth/sign-up"
                  className="font-medium text-slate-900 underline-offset-2 hover:text-slate-700 hover:underline dark:text-white dark:hover:text-slate-200"
                >
                  Register
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <p className="fixed bottom-4 left-0 right-0 text-center text-xs text-white/80">
        © TEMU Tech
      </p>
    </main>
  );
}