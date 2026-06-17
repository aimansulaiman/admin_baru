"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import GoogleSigninButton from "../GoogleSigninButton";
import SigninWithPassword from "../SigninWithPassword";

export default function Signin() {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();

  const callbackURL = searchParams.get("callbackUrl") || "/";

  useEffect(() => {
    const message = searchParams.get("message");

    // Only handles error toasts
    if (message) {
      toast.error(message);
    }
  }, [searchParams]);

  return (
    <>
      <GoogleSigninButton
        text="Sign in"
        callbackURL={callbackURL}
        loading={loading}
        setLoading={setLoading}
      />

      <div className="my-6 flex items-center justify-center">
        <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
        <div className="block w-full min-w-fit bg-white px-3 text-center font-medium dark:bg-gray-dark">
          Or sign in with email
        </div>
        <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
      </div>

      <div>
        <SigninWithPassword
          loading={loading}
          setLoading={setLoading}
          callbackURL={callbackURL}
        />
      </div>

      <div className="mt-6 text-center">
        <p>
          Don’t have any account?{" "}
          <Link href="/auth/sign-up" className="text-primary">
            Sign Up
          </Link>
        </p>
      </div>
    </>
  );
}
