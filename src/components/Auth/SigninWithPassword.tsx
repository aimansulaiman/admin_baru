"use client";

import { EmailIcon, PasswordIcon } from "@/assets/icons";
import { authClient } from "@/lib/auth/auth-client";
import Link from "next/link";
import {
  Controller,
  type FieldErrors,
  type Resolver,
  useForm,
} from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import InputGroup from "../FormElements/InputGroup";
import { Checkbox } from "../ui-elements/checkbox";

const signinSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address."),
  password: z.string().min(1, "Please enter your password."),
  remember: z.boolean().default(false),
});

type SigninFormValues = z.infer<typeof signinSchema>;

const signinResolver: Resolver<SigninFormValues> = async (values) => {
  const result = signinSchema.safeParse(values);

  if (result.success) {
    return {
      values: result.data,
      errors: {},
    };
  }

  const errors: Partial<
    Record<keyof SigninFormValues, { type: string; message: string }>
  > = {};

  result.error.issues.forEach((issue) => {
    const fieldName = issue.path[0];

    if (typeof fieldName === "string") {
      const key = fieldName as keyof SigninFormValues;

      if (!errors[key]) {
        errors[key] = {
          type: issue.code,
          message: issue.message,
        };
      }
    }
  });

  return {
    values: {},
    errors: errors as FieldErrors<SigninFormValues>,
  };
};

export default function SigninWithPassword({
  loading,
  setLoading,
  callbackURL = "/",
}: {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  callbackURL?: string;
}) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<SigninFormValues>({
    resolver: signinResolver,
    mode: "onTouched",
    defaultValues: {
      email: process.env.NEXT_PUBLIC_DEMO_USER_EMAIL || "",
      password: process.env.NEXT_PUBLIC_DEMO_USER_PASS || "",
      remember: false,
    },
  });

  const handleSignin = handleSubmit(async (values) => {
    setLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email: values.email.trim().toLowerCase(),
        password: values.password,
        rememberMe: values.remember,
        callbackURL,
      });

      if (error) {
        toast.error(error.message ?? "Unable to sign in");
        return;
      }

      toast.success("Logged in successfully");
      reset();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unable to sign in";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  });

  const disabled = loading || isSubmitting;

  return (
    <form onSubmit={handleSignin} noValidate>
      <Controller
        control={control}
        name="email"
        render={({ field, fieldState }) => (
          <div className="mb-4">
            <InputGroup
              type="email"
              label="Email"
              className="[&_input]:py-3.75"
              placeholder="Enter your email"
              name={field.name}
              handleChange={field.onChange}
              value={field.value}
              error={fieldState.error?.message}
              icon={<EmailIcon />}
              disabled={disabled}
              required
              autoComplete="email"
              autoCapitalize="none"
              autoCorrect="off"
            />
          </div>
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field, fieldState }) => (
          <div className="mb-5">
            <InputGroup
              type="password"
              label="Password"
              className="[&_input]:py-3.75"
              placeholder="Enter your password"
              name={field.name}
              handleChange={field.onChange}
              value={field.value}
              error={fieldState.error?.message}
              icon={<PasswordIcon />}
              disabled={disabled}
              required
              autoComplete="current-password"
            />
          </div>
        )}
      />

      <div className="mb-6 flex items-center justify-between gap-2 py-2 font-medium">
        <Controller
          control={control}
          name="remember"
          render={({ field }) => (
            <Checkbox
              label="Remember me"
              name={field.name}
              withIcon="check"
              minimal
              radius="md"
              onChange={(e) => field.onChange(e.target.checked)}
            />
          )}
        />

        <Link
          href="/auth/forgot-password"
          className="hover:text-primary dark:text-white dark:hover:text-primary"
        >
          Forgot Password?
        </Link>
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
