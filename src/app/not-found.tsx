import { ArrowLeftIcon } from "@/assets/icons";
import Image from "next/image";
import Link from "next/link";
import { FrownEmojiIcon } from "./(site)/(with-layout)/pages/error-page/_components/icons";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-svh items-center justify-center">
      <div className="mx-auto w-full max-w-143.75 px-4 sm:px-8 xl:px-0">
        <div className="relative z-1 lg:pt-15 xl:pt-20 2xl:pt-46.75">
          <div className="absolute top-0 left-0 -z-1">
            <Image
              src="/images/grids/grid-01.svg"
              role="presentation"
              alt=""
              width={575}
              height={460}
              className="dark:opacity-20"
            />
          </div>

          <div className="text-center">
            <div className="mx-auto mb-10 flex h-28.5 w-full max-w-28.5 items-center justify-center rounded-full border border-stroke bg-white text-dark shadow-error dark:border-dark-3 dark:bg-dark-2 dark:text-white">
              <FrownEmojiIcon />
            </div>

            <h1 className="mb-5 text-heading-4 font-black text-dark lg:text-heading-3 dark:text-white">
              Page not found
            </h1>

            <p className="mx-auto w-full max-w-88.75">
              The page you are looking for doesn’t exist. Here are some helpful
              links:
            </p>

            <Link
              href="/"
              className="hover:bg-opacity-90 mt-8 inline-flex items-center gap-2 rounded-[7px] bg-primary px-6 py-3 font-medium text-white"
            >
              <ArrowLeftIcon />

              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
