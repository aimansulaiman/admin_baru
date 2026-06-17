"use client";
import Link from "next/link";
import { useState } from "react";
import GoogleSigninButton from "../GoogleSigninButton";
import SignupWithPassword from "../SignupWithPassword";

export default function Signup() {
  const [loading, setLoading] = useState(false);

  return (
    <>
      <GoogleSigninButton
        text="Sign up"
        loading={loading}
        setLoading={setLoading}
      />

      <div className="my-6 flex items-center justify-center">
        <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
        <div className="block w-full min-w-fit bg-white px-3 text-center font-medium dark:bg-gray-dark">
          Or sign up with email
        </div>
        <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
      </div>

      <SignupWithPassword loading={loading} setLoading={setLoading} />

      <div className="mt-4.5 text-center font-medium">
        <p>
          Already have an account?{" "}
          <Link href="/auth/sign-in" className="text-primary">
            Sign in
          </Link>
        </p>
      </div>
    </>
  );
}
