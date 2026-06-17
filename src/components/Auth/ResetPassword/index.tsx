"use client";
import { PasswordIcon } from "@/assets/icons";
import InputGroup from "@/components/FormElements/InputGroup";
import { authClient } from "@/lib/auth/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

export default function ResetPassword({ token }: { token: string }) {
  const [data, setData] = useState({
    newPassword: "",
    ReNewPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (data.newPassword === "") {
      toast.error("Please enter your password.");
      return;
    }

    if (data.newPassword !== data.ReNewPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Updating password...");
    try {
      const { error } = await authClient.resetPassword({
        newPassword: data.newPassword,
        token,
      });

      if (error) {
        toast.error(error?.message || "Failed to update password", {
          id: toastId,
        });
        return;
      }

      toast.success("Password updated successfully", { id: toastId });
      setData({ newPassword: "", ReNewPassword: "" });
      router.push("/auth/sign-in");
    } catch (error: any) {
      toast.error(error?.message ?? "Something went wrong", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-7.5 text-center">
        <h3 className="font-satoshi mb-4 text-heading-5 font-bold text-dark dark:text-white">
          Create New Password
        </h3>
        <p>Create new password to save your account</p>
      </div>

      <form onSubmit={handleSubmit}>
        <input type="hidden" name="token" value={token} readOnly />
        <InputGroup
          type="password"
          label="New Password"
          className="mb-5 [&_input]:py-3.75"
          placeholder="Enter your new password"
          name="newPassword"
          handleChange={handleChange}
          value={data.newPassword}
          icon={<PasswordIcon />}
        />

        <InputGroup
          type="password"
          label="Re-type new password"
          className="mb-6 [&_input]:py-3.75"
          placeholder="Re-enter your new password"
          name="ReNewPassword"
          handleChange={handleChange}
          value={data.ReNewPassword}
          icon={<PasswordIcon />}
        />

        <div className="mb-5">
          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            className={`hover:bg-opacity-90 w-full rounded-lg bg-primary p-4 font-medium text-white transition ${
              loading ? "cursor-not-allowed opacity-60" : "cursor-pointer"
            }`}
          >
            {loading ? "Creating..." : "Create Password"}
          </button>
        </div>

        <div className="mt-4.5 text-center font-medium">
          <p>
            Already have an account?{" "}
            <Link href="/auth/sign-in" className="text-primary">
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </>
  );
}
