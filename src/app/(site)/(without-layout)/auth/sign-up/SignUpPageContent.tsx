"use client";

import {
  useCreateUserMutation,
  useVerifyCreateUserUnlockMutation,
} from "@/app/api/rtk/userApi";
import type { CreateUserInput } from "@/types/user";
import Image from "next/image";
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

const SignUpPageContent = () => {
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
      alert("New user password confirmation does not match.");
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

  return (
    <main className="rounded-[10px] bg-white dark:bg-gray-dark">
      <div className="flex min-h-svh flex-wrap items-center">
        <div className="w-full xl:w-1/2">
          <div className="mx-auto max-w-[560px] px-8 py-10">
            <div className="mb-8 text-center xl:hidden">
              <Image
                src="/images/logo/logo-dark.svg"
                alt="MULA Coffee Logo"
                width={176}
                height={32}
                className="mx-auto dark:hidden"
              />

              <Image
                src="/images/logo/logo.svg"
                alt="MULA Coffee Logo"
                width={176}
                height={32}
                className="mx-auto hidden dark:block"
              />

              <h1 className="mt-6 text-2xl font-bold text-dark dark:text-white">
                Create MULA Admin Account
              </h1>

              <p className="mt-2 text-sm text-dark-4 dark:text-dark-6">
                Account creation requires admin authorization.
              </p>
            </div>

            {!isUnlocked ? (
              <div className="rounded-2xl border border-stroke bg-white p-6 shadow-1 dark:border-dark-3 dark:bg-gray-dark">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-dark dark:text-white">
                    Unlock Account Creation
                  </h2>

                  <p className="mt-2 text-sm text-dark-4 dark:text-dark-6">
                    Enter the unlock password to open the user creation form.
                  </p>
                </div>

                <form onSubmit={handleUnlockSubmit}>
                  <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                    Unlock Password
                  </label>

                  <input
                    type="password"
                    value={unlockPassword}
                    onChange={(event) => setUnlockPassword(event.target.value)}
                    placeholder="Enter unlock password"
                    className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
                    required
                  />

                  <button
                    type="submit"
                    disabled={isVerifyingUnlock}
                    className="mt-5 w-full rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-60"
                  >
                    {isVerifyingUnlock ? "Checking..." : "Unlock Form"}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <Link
                    href="/auth/sign-in"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Back to Sign In
                  </Link>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-stroke bg-white p-6 shadow-1 dark:border-dark-3 dark:bg-gray-dark">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-dark dark:text-white">
                    Create New Account
                  </h2>

                  <p className="mt-2 text-sm text-dark-4 dark:text-dark-6">
                    Fill in the new user details. The admin creation password is
                    different from the new user password.
                  </p>
                </div>

                <form onSubmit={handleCreateSubmit}>
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                        First Name
                      </label>

                      <input
                        type="text"
                        value={form.first_name}
                        onChange={(event) =>
                          handleFormChange("first_name", event.target.value)
                        }
                        className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                        Last Name
                      </label>

                      <input
                        type="text"
                        value={form.last_name}
                        onChange={(event) =>
                          handleFormChange("last_name", event.target.value)
                        }
                        className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                        Email Address
                      </label>

                      <input
                        type="email"
                        value={form.email}
                        onChange={(event) =>
                          handleFormChange("email", event.target.value)
                        }
                        className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                        New User Password
                      </label>

                      <input
                        type="password"
                        value={form.password}
                        onChange={(event) =>
                          handleFormChange("password", event.target.value)
                        }
                        placeholder="Minimum 8 characters"
                        className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                        Confirm New User Password
                      </label>

                      <input
                        type="password"
                        value={form.password_confirmation}
                        onChange={(event) =>
                          handleFormChange(
                            "password_confirmation",
                            event.target.value,
                          )
                        }
                        placeholder="Re-enter password"
                        className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                        Admin Creation Password
                      </label>

                      <input
                        type="password"
                        value={form.admin_password}
                        onChange={(event) =>
                          handleFormChange(
                            "admin_password",
                            event.target.value,
                          )
                        }
                        placeholder="Required to create this account"
                        className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-dark-3"
                        required
                      />

                      <p className="mt-2 text-xs text-dark-4 dark:text-dark-6">
                        This is the admin creation password. It is not the same
                        as the new user password.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="submit"
                      disabled={isCreating}
                      className="w-full rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-60"
                    >
                      {isCreating ? "Creating..." : "Create Account"}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsUnlocked(false);
                        setUnlockPassword("");
                        setForm(initialCreateForm);
                      }}
                      className="w-full rounded-lg bg-gray-500 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </form>

                <div className="mt-6 text-center">
                  <Link
                    href="/auth/sign-in"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Back to Sign In
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="hidden w-full p-7.5 xl:block xl:w-1/2">
          <div className="custom-gradient-1 flex min-h-[calc(100svh-60px)] flex-col justify-between overflow-hidden rounded-2xl px-12.5 pt-12.5 dark:bg-dark-2! dark:bg-none">
            <div>
              <Link className="mb-10 inline-block" href="/auth/sign-in">
                <Image
                  className="hidden dark:block"
                  src="/images/logo/logo.svg"
                  alt="MULA Coffee Logo"
                  width={176}
                  height={32}
                />

                <Image
                  className="dark:hidden"
                  src="/images/logo/logo-dark.svg"
                  alt="MULA Coffee Logo"
                  width={176}
                  height={32}
                />
              </Link>

              <p className="mb-3 text-xl font-medium text-dark dark:text-white">
                MULA Coffee
              </p>

              <h1 className="mb-4 text-2xl font-bold text-dark sm:text-heading-3 dark:text-white">
                Administration Account Creation
              </h1>

              <p className="w-full max-w-93.75 font-medium text-dark-4 dark:text-dark-6">
                Create new admin accounts only after verifying the unlock
                password and admin creation password.
              </p>

              <div className="mt-8 grid gap-4">
                <div className="rounded-xl border border-white/20 bg-white/20 p-5 backdrop-blur-sm dark:border-dark-3 dark:bg-dark/20">
                  <p className="text-base font-semibold text-dark dark:text-white">
                    Step 1: Unlock Form
                  </p>
                  <p className="mt-1 text-sm text-dark-4 dark:text-dark-6">
                    The first password opens the account creation form.
                  </p>
                </div>

                <div className="rounded-xl border border-white/20 bg-white/20 p-5 backdrop-blur-sm dark:border-dark-3 dark:bg-dark/20">
                  <p className="text-base font-semibold text-dark dark:text-white">
                    Step 2: Create Account
                  </p>
                  <p className="mt-1 text-sm text-dark-4 dark:text-dark-6">
                    The second admin password authorizes creating the new user.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <Image
                src="/images/grids/grid-02.svg"
                alt="Administration illustration"
                width={405}
                height={325}
                className="mx-auto dark:opacity-30"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SignUpPageContent;