import CountDownTimer from "@/components/CountDownTimer";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SocialAccounts } from "./_components/social-links";

export const metadata: Metadata = {
  title: "Under Maintenance Page",
};

export default function Page() {
  return (
    <div className="bg-white sm:px-6 dark:bg-gray-dark">
      <div className="flex min-h-svh flex-col overflow-hidden">
        <div className="flex h-full flex-wrap items-center">
          <div className="w-full xl:flex xl:w-1/2 xl:items-center xl:justify-center">
            <div className="mx-auto px-6 sm:p-0 xl:px-8">
              <div className="flex min-h-svh flex-col items-center justify-center pt-20 pb-10 text-center lg:items-start lg:text-start xl:py-0">
                <div>
                  <Link
                    href="/"
                    className="mb-10 flex justify-center lg:justify-start"
                  >
                    <Image
                      width={176}
                      height={32}
                      src={"/images/logo/logo-dark.svg"}
                      alt="Logo"
                      priority
                      className="dark:hidden"
                    />
                    <Image
                      width={176}
                      height={32}
                      src={"/images/logo/logo.svg"}
                      alt="Logo"
                      priority
                      className="hidden dark:block"
                    />
                  </Link>

                  <h1 className="mb-2.5 text-3xl font-black text-dark lg:text-4xl xl:text-[50px] xl:leading-15 dark:text-white">
                    Under Maintenance
                  </h1>

                  <p className="font-medium text-dark-4 dark:text-dark-6">
                    Our website is under maintenance, wait for some time.
                  </p>
                </div>

                <div className="mt-10">
                  <CountDownTimer />
                </div>

                <SocialAccounts />
              </div>
            </div>
          </div>

          <div className="hidden w-full lg:w-1/2 xl:block">
            <div className="my-7.5 text-center">
              <div className="custom-gradient-1 overflow-hidden rounded-2xl py-45">
                <span className="inline-block">
                  <Image
                    width={562}
                    height={562}
                    src={"/images/illustration/illustration-04.svg"}
                    alt="illustration"
                  />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
