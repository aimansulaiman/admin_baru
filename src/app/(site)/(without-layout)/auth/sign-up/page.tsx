import Signup from "@/components/Auth/Signup";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "MULA Coffee Sign Up",
};

export default function SignUpPage() {
  return (
    <main className="min-h-svh bg-[#B92732]">
      <div className="flex min-h-svh flex-wrap items-center justify-center px-6 py-10">
        <section className="flex w-full items-center justify-center xl:w-1/2">
          <div className="w-full max-w-[420px] rounded-xl bg-white px-8 py-10 shadow-2xl">
            <Signup />
          </div>
        </section>

        <section className="mt-12 flex w-full items-center justify-center xl:mt-0 xl:w-1/2">
          <div className="text-center text-white">
            <h2 className="text-3xl font-medium">Welcome to</h2>

            <div className="mt-10 flex justify-center">
              <Image
                src="/images/logo/logo.svg"
                alt="MULA Coffee Logo"
                width={230}
                height={120}
                priority
              />
            </div>

            <h1 className="mt-14 text-4xl font-light leading-tight">
              MULA COFFEE
              <br />
              ADMINISTRATION SYSTEM
            </h1>

            <p className="mt-6 max-w-[520px] text-base leading-7 text-white/80">
              Create a new admin account only with valid authorization from the
              system administrator.
            </p>
          </div>
        </section>
      </div>

      <p className="fixed bottom-6 left-0 right-0 text-center text-sm text-white">
        © MULA Coffee
      </p>
    </main>
  );
}