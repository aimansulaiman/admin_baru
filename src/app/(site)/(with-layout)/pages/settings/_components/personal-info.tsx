"use client";

import {
  CallIcon,
  EmailIcon,
  PencilSquareIcon,
  UserIcon,
} from "@/assets/icons";
import InputGroup from "@/components/FormElements/InputGroup";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { authClient } from "@/lib/auth/auth-client";
import { useEffect, useMemo } from "react";
import {
  Controller,
  type FieldErrors,
  type Resolver,
  useForm,
} from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";

export interface UserInfo {
  name: string;
  phoneNumber?: string;
  email: string;
  bio?: string;
}

const personalInfoSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name."),
  phoneNumber: z.string().trim().optional(),
  bio: z.string().trim().optional(),
});

type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>;

const personalInfoResolver: Resolver<PersonalInfoFormValues> = async (
  values,
) => {
  const result = personalInfoSchema.safeParse(values);

  if (result.success) {
    return {
      values: result.data,
      errors: {},
    };
  }

  const errors: Partial<
    Record<keyof PersonalInfoFormValues, { type: string; message: string }>
  > = {};

  result.error.issues.forEach((issue) => {
    const fieldName = issue.path[0];

    if (typeof fieldName === "string") {
      const key = fieldName as keyof PersonalInfoFormValues;

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
    errors: errors as FieldErrors<PersonalInfoFormValues>,
  };
};

export function PersonalInfoForm(personalInfo: UserInfo) {
  const { name, phoneNumber = "", email, bio = "" } = personalInfo;

  const initialValues = useMemo<PersonalInfoFormValues>(
    () => ({
      name,
      phoneNumber,
      bio,
    }),
    [name, phoneNumber, bio],
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<PersonalInfoFormValues>({
    resolver: personalInfoResolver,
    mode: "onTouched",
    defaultValues: initialValues,
  });

  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  const handleUpdate = handleSubmit(async (values) => {
    const updatePayload = {
      name: values.name.trim(),
      ...(values.phoneNumber?.trim()
        ? { phone: values.phoneNumber.trim() }
        : {}),
      ...(values.bio?.trim() ? { bio: values.bio.trim() } : {}),
    };

    const updatePromise = authClient.updateUser(updatePayload);

    toast.promise(updatePromise, {
      loading: "Updating profile...",
      success: "Profile updated successfully!",
      error: "Failed to update profile. Please try again.",
    });

    await updatePromise;
  });

  const disabled = isSubmitting;

  if (!email) {
    return (
      <ShowcaseSection title="Personal Information" className="p-7!">
        <div className="flex items-center justify-center py-8">
          <p className="text-gray-500">Loading...</p>
        </div>
      </ShowcaseSection>
    );
  }

  return (
    <ShowcaseSection title="Personal Information" className="p-7!">
      <form onSubmit={handleUpdate} noValidate>
        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <Controller
            control={control}
            name="name"
            render={({ field, fieldState }) => (
              <div className="w-full sm:w-1/2">
                <InputGroup
                  className="[&_input]:py-2.5"
                  type="text"
                  name={field.name}
                  label="Full Name"
                  placeholder="David Jhon"
                  value={field.value}
                  handleChange={field.onChange}
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
            name="phoneNumber"
            render={({ field, fieldState }) => (
              <div className="w-full sm:w-1/2">
                <InputGroup
                  className="[&_input]:py-2.5"
                  type="text"
                  name={field.name}
                  label="Phone Number"
                  placeholder="+990 3343 7865"
                  value={field.value}
                  handleChange={field.onChange}
                  error={fieldState.error?.message}
                  icon={<CallIcon />}
                  disabled={disabled}
                  autoComplete="tel"
                />
              </div>
            )}
          />
        </div>

        <InputGroup
          className="mb-5.5 [&_input]:py-2.5"
          type="email"
          name="email"
          label="Email Address"
          placeholder="devidjond45@gmail.com"
          value={email}
          icon={<EmailIcon />}
          disabled
          autoComplete="email"
          autoCapitalize="none"
          autoCorrect="off"
        />

        <InputGroup
          className="mb-5.5 [&_input]:py-2.5"
          type="text"
          name="username"
          label="Username"
          placeholder="devidjhon24"
          icon={<UserIcon />}
          disabled
        />

        <Controller
          control={control}
          name="bio"
          render={({ field, fieldState }) => (
            <div className="mb-5.5">
              <TextAreaGroup
                className="mb-2"
                name={field.name}
                label="BIO"
                placeholder="Write your bio here"
                icon={<PencilSquareIcon />}
                value={field.value}
                onChange={field.onChange}
                error={fieldState.error?.message}
                disabled={disabled}
                rows={6}
              />
            </div>
          )}
        />

        <div className="flex justify-end gap-3">
          <button
            className="rounded-lg border border-stroke px-6 py-1.75 font-medium text-dark hover:shadow-1 disabled:opacity-50 dark:border-dark-3 dark:text-white"
            type="button"
            onClick={() => reset(initialValues)}
            disabled={disabled}
          >
            Cancel
          </button>

          <button
            className="hover:bg-opacity-90 cursor-pointer rounded-lg bg-primary px-6 py-1.75 font-medium text-gray-2 disabled:opacity-50"
            type="submit"
            disabled={disabled}
          >
            {disabled ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </ShowcaseSection>
  );
}
