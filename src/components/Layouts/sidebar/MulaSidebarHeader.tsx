"use client";

import MulaLogo from "@/assets/logos/MulaLogo.png";
import Image from "next/image";
import Link from "next/link";

export default function MulaSidebarHeader() {
  return (
    <div className="overflow-hidden bg-white dark:bg-gray-dark">
      <Link href="/" className="block px-5 pt-6 pb-5 text-center">
        <div className="mx-auto mb-3 flex justify-center">
          <Image
            src={MulaLogo}
            alt="MULA Coffee Logo"
            width={100}
            height={100}
            className="h-auto w-[100px]"
            priority
          />
        </div>

        <h1 className="text-2xl font-extrabold leading-none tracking-tight">
          <span className="text-primary">MULA</span>{" "}
          <span className="text-dark dark:text-white">Coffee</span>
        </h1>

        <p className="mt-2 text-xs font-bold uppercase tracking-[0.22em] text-dark-5 dark:text-dark-6">
          Management System
        </p>
      </Link>
    </div>
  );
}