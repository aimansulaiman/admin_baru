"use client";

import { EmailIcon, PasswordIcon } from "@/assets/icons";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import InputGroup from "../FormElements/InputGroup";
import { Checkbox } from "../ui-elements/checkbox";

export default function SigninWithPassword({
  loading,
  setLoading,
  callbackURL = "/",
}: {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  callbackURL?: string;
}) {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "admin@example.com",
    password: "admin123",
    remember: false,
  });

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, checked, type } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSignin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);

    const dummyUser = {
      id: "demo-user-1",
      name: "Demo Admin",
      email: formData.email || "admin@example.com",
      image: "/images/user/user-01.png",
      role: "admin",
      banned: false,
      emailVerified: true,
    };

    const dummyAuth = {
      token: "demo-token",
      user: dummyUser,
      isAuthenticated: true,
    };

    localStorage.setItem("demo_auth", JSON.stringify(dummyAuth));

    toast.success("Dummy login successful");

    setTimeout(() => {
      router.push(callbackURL || "/");
      router.refresh();
    }, 500);

    setLoading(false);
  }

  const disabled = loading;

  return (
    <form onSubmit={handleSignin} noValidate>
      <div className="mb-4">
        <InputGroup
          type="email"
          label="Email"
          className="[&_input]:py-3.75"
          placeholder="Enter any email"
          name="email"
          handleChange={handleChange}
          value={formData.email}
          icon={<EmailIcon />}
          disabled={disabled}
          required
          autoComplete="email"
          autoCapitalize="none"
          autoCorrect="off"
        />
      </div>

      <div className="mb-5">
        <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
          Password
        </label>

        <div className="relative">
          <InputGroup
            type={showPassword ? "text" : "password"}
            label=""
            className="[&_input]:py-3.75 [&_input]:pr-20"
            placeholder="Enter any password"
            name="password"
            handleChange={handleChange}
            value={formData.password}
            icon={<PasswordIcon />}
            disabled={disabled}
            required
            autoComplete="current-password"
          />

          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            disabled={disabled}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-primary disabled:opacity-60"
          >
            {showPassword ? "Hide" : "View"}
          </button>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between gap-2 py-2 font-medium">
        <Checkbox
          label="Remember me"
          name="remember"
          withIcon="check"
          minimal
          radius="md"
          onChange={handleChange}
        />

        <span className="text-sm text-dark-4 dark:text-dark-6">
          Dummy auth mode
        </span>
      </div>

      <div className="mb-4.5">
        <button
          type="submit"
          disabled={disabled}
          className="hover:bg-opacity-90 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-80"
        >
          Sign In

          {disabled && (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent dark:border-primary dark:border-t-transparent" />
          )}
        </button>
      </div>
    </form>
  );
}