"use client";

import {
  useCreateUserMutation,
  useVerifyCreateUserUnlockMutation,
} from "@/app/api/rtk/userApi";
import type { CreateUserInput } from "@/types/user";
import Link from "next/link";
import { FormEvent, useState } from "react";

const initialCreateForm: CreateUserInput = {
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  password_confirmation: "",
  admin_password: "",
};

const Signup = () => {
  const [unlockPassword, setUnlockPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);

  const [form, setForm] = useState<CreateUserInput>(initialCreateForm);

  const [verifyCreateUserUnlock, { isLoading: isVerifyingUnlock }] =
    useVerifyCreateUserUnlockMutation();

  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();

  const handleUnlockSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!unlockPassword.trim()) {
      alert("Please enter unlock password.");
      return;
    }

    try {
      await verifyCreateUserUnlock({
        password: unlockPassword,
      }).unwrap();

      setIsUnlocked(true);
    } catch (error: any) {
      alert(error?.data?.message || error?.message || "Incorrect password.");
    }
  };

  const handleFormChange = (key: keyof CreateUserInput, value: string) => {
    setForm((previousForm) => ({
      ...previousForm,
      [key]: value,
    }));
  };

  const handleCreateSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.first_name.trim()) {
      alert("Please enter first name.");
      return;
    }

    if (!form.last_name.trim()) {
      alert("Please enter last name.");
      return;
    }

    if (!form.email.trim()) {
      alert("Please enter email.");
      return;
    }

    if (!form.password.trim()) {
      alert("Please enter new user password.");
      return;
    }

    if (form.password.length < 8) {
      alert("New user password must be at least 8 characters.");
      return;
    }

    if (form.password !== form.password_confirmation) {
      alert("Password confirmation does not match.");
      return;
    }

    if (!form.admin_password.trim()) {
      alert("Please enter admin creation password.");
      return;
    }

    try {
      await createUser(form).unwrap();

      alert("Account created successfully. You can now sign in.");
      window.location.href = "/auth/sign-in";
    } catch (error: any) {
      alert(
        error?.data?.message ||
          error?.message ||
          "Failed to create account.",
      );
    }
  };

  if (!isUnlocked) {
    return (
      <div>
        <div className="mb-7 text-center">
          <h1 className="text-2xl font-bold text-slate-900">
            Create Account
          </h1>

          <p className="mt-3 text-xs leading-5 text-slate-500">
            Enter the unlock password to open the account creation form.
          </p>
        </div>

        <form onSubmit={handleUnlockSubmit}>
          <div className="mb-5">
            <label className="mb-2.5 block font-medium text-slate-900">
              Unlock Password
            </label>

            <input
              type="password"
              value={unlockPassword}
              onChange={(event) => setUnlockPassword(event.target.value)}
              placeholder="Enter unlock password"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-primary"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isVerifyingUnlock}
            className="flex w-full items-center justify-center rounded-lg bg-primary px-6 py-3 font-medium text-white hover:bg-opacity-90 disabled:opacity-60"
          >
            {isVerifyingUnlock ? "Checking..." : "Unlock Form"}
          </button>
        </form>

        <div className="mt-7 text-center">
          <p className="text-xs text-slate-600">
            Already have an account?{" "}
            <Link
              href="/auth/sign-in"
              className="font-semibold text-slate-900 underline hover:text-primary"
            >
              Sign In.
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-7 text-center">
        <h1 className="text-2xl font-bold text-slate-900">
          Register Account
        </h1>

        <p className="mt-3 text-xs leading-5 text-slate-500">
          Fill in the new user details. The admin creation password is different
          from the new user password.
        </p>
      </div>

      <form onSubmit={handleCreateSubmit}>
        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-900">
              First Name
            </label>

            <input
              type="text"
              value={form.first_name}
              onChange={(event) =>
                handleFormChange("first_name", event.target.value)
              }
              placeholder="First name"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-primary"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-900">
              Last Name
            </label>

            <input
              type="text"
              value={form.last_name}
              onChange={(event) =>
                handleFormChange("last_name", event.target.value)
              }
              placeholder="Last name"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-primary"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-slate-900">
            Email
          </label>

          <input
            type="email"
            value={form.email}
            onChange={(event) => handleFormChange("email", event.target.value)}
            placeholder="Email address"
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-primary"
            required
          />
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-slate-900">
            New User Password
          </label>

          <input
            type="password"
            value={form.password}
            onChange={(event) =>
              handleFormChange("password", event.target.value)
            }
            placeholder="Minimum 8 characters"
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-primary"
            required
          />
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-slate-900">
            Confirm New User Password
          </label>

          <input
            type="password"
            value={form.password_confirmation}
            onChange={(event) =>
              handleFormChange("password_confirmation", event.target.value)
            }
            placeholder="Re-enter password"
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-primary"
            required
          />
        </div>

        <div className="mb-5">
          <label className="mb-2 block text-sm font-medium text-slate-900">
            Admin Creation Password
          </label>

          <input
            type="password"
            value={form.admin_password}
            onChange={(event) =>
              handleFormChange("admin_password", event.target.value)
            }
            placeholder="Required to create account"
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-primary"
            required
          />

          <p className="mt-2 text-xs text-slate-500">
            This password is not the same as the new user password.
          </p>
        </div>

        <button
          type="submit"
          disabled={isCreating}
          className="flex w-full items-center justify-center rounded-lg bg-primary px-6 py-3 font-medium text-white hover:bg-opacity-90 disabled:opacity-60"
        >
          {isCreating ? "Creating..." : "Create Account"}
        </button>
      </form>

      <div className="mt-7 text-center">
        <button
          type="button"
          onClick={() => {
            setIsUnlocked(false);
            setUnlockPassword("");
            setForm(initialCreateForm);
          }}
          className="mr-3 text-xs font-semibold text-slate-700 underline hover:text-primary"
        >
          Back
        </button>

        <Link
          href="/auth/sign-in"
          className="text-xs font-semibold text-slate-900 underline hover:text-primary"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default Signup;