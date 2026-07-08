"use client";

import { useLoginMutation } from "@/app/api/rtk/authApi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

const Signin = () => {
  const router = useRouter();

  const [login, { isLoading }] = useLoginMutation();

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const updateForm = (key: string, value: string | boolean) => {
    setForm((previousForm) => ({
      ...previousForm,
      [key]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.email.trim()) {
      alert("Please enter email.");
      return;
    }

    if (!form.password.trim()) {
      alert("Please enter password.");
      return;
    }

    try {
      const response = await login({
        email: form.email,
        password: form.password,
      }).unwrap();

      localStorage.setItem("mula_auth_token", response.data.token);
      localStorage.setItem("mula_auth_user", JSON.stringify(response.data.user));

      const cookieMaxAge = form.remember ? 60 * 60 * 24 * 7 : 60 * 60 * 8;

      document.cookie = `mula_auth_token=${encodeURIComponent(
        response.data.token,
      )}; path=/; max-age=${cookieMaxAge}; SameSite=Lax`;

      const redirectUrl = new URLSearchParams(window.location.search).get(
        "redirect",
      );

      router.replace(redirectUrl || "/store-management");
    } catch (error: any) {
      alert(error?.data?.message || error?.message || "Failed to login.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-5">
        <label className="mb-2.5 block font-medium text-dark">Email</label>

        <input
          type="email"
          value={form.email}
          onChange={(event) => updateForm("email", event.target.value)}
          placeholder="your email"
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-dark outline-none focus:border-primary"
        />
      </div>

      <div className="mb-4">
        <label className="mb-2.5 block font-medium text-dark">Password</label>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={(event) => updateForm("password", event.target.value)}
            placeholder="password"
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 pr-20 text-dark outline-none focus:border-primary"
          />

          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-primary"
          >
            {showPassword ? "Hide" : "View"}
          </button>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between gap-3">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={form.remember}
            onChange={(event) => updateForm("remember", event.target.checked)}
            className="h-4 w-4 rounded border-slate-300"
          />

          Remember me
        </label>

        <Link
          href="/auth/forgot-password"
          className="text-sm font-medium text-primary hover:underline"
        >
          Forgot your password?
        </Link>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="flex w-full items-center justify-center rounded-lg bg-primary px-6 py-3 font-medium text-white hover:bg-opacity-90 disabled:opacity-60"
      >
        {isLoading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};

export default Signin;