"use client";

import { EmailIcon, PasswordIcon, UserIcon } from "@/assets/icons";
import { authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import {
  Controller,
  type FieldErrors,
  type Resolver,
  useForm,
} from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import InputGroup from "../FormElements/InputGroup";

const signupSchema = z
  .object({
    name: z.string().trim().min(2, "Please enter your full name."),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Please enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters long."),
    reEnterPassword: z.string().min(1, "Please re-enter your password."),
  })
  .superRefine((values, ctx) => {
    if (values.password !== values.reEnterPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["reEnterPassword"],
        message: "Passwords do not match.",
      });
    }
  });

type SignupFormValues = z.infer<typeof signupSchema>;

const signupResolver: Resolver<SignupFormValues> = async (values) => {
  const result = signupSchema.safeParse(values);

  if (result.success) {
    return {
      values: result.data,
      errors: {},
    };
  }

  const errors: Partial<
    Record<keyof SignupFormValues, { type: string; message: string }>
  > = {};

  result.error.issues.forEach((issue) => {
    const fieldName = issue.path[0];

    if (typeof fieldName === "string") {
      const key = fieldName as keyof SignupFormValues;

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
    errors: errors as FieldErrors<SignupFormValues>,
  };
};

const SignupWithPassword = ({
  loading,
  setLoading,
}: {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}) => {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: signupResolver,
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      reEnterPassword: "",
    },
  });

  const handleSignup = handleSubmit(async (values) => {
    setLoading(true);

    try {
      const { error } = await authClient.signUp.email({
        name: values.name.trim(),
        email: values.email.trim().toLowerCase(),
        password: values.password,
      });

      if (error) {
        toast.error(error.message ?? "Unable to create your account.");
        return;
      }

      toast.success("User has been registered");
      reset();
      router.push(
        `/auth/verify-email?email=${encodeURIComponent(values.email.trim().toLowerCase())}`,
      );
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  });

  const disabled = loading || isSubmitting;

  return (
    <form onSubmit={handleSignup} noValidate>
      <Controller
        control={control}
        name="name"
        render={({ field, fieldState }) => (
          <div className="mb-4">
            <InputGroup
              type="text"
              label="Name"
              className="[&_input]:py-3.75"
              placeholder="Enter your full name"
              name={field.name}
              handleChange={field.onChange}
              value={field.value}
              error={fieldState.error?.message}
              icon={<UserIcon />}
              disabled={disabled}
              required
              autoComplete="name"
            />
          </div>
        )}
      />

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
          <div className="mb-4">
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
              autoComplete="new-password"
            />
          </div>
        )}
      />

      <Controller
        control={control}
        name="reEnterPassword"
        render={({ field, fieldState }) => (
          <div className="mb-6">
            <InputGroup
              type="password"
              label="Re-type Password"
              className="[&_input]:py-3.75"
              placeholder="Re-enter your password"
              name={field.name}
              handleChange={field.onChange}
              value={field.value}
              error={fieldState.error?.message}
              icon={<PasswordIcon />}
              disabled={disabled}
              required
              autoComplete="new-password"
            />
          </div>
        )}
      />

      <button
        type="submit"
        disabled={disabled}
        className="hover:bg-opacity-90 mb-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-80"
      >
        Create account
        {disabled && (
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent dark:border-dark dark:border-t-transparent" />
        )}
      </button>
    </form>
  );
};

export default SignupWithPassword;
