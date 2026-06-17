"use server";

import { resend } from "./resend";

type SendEmailParams = {
  to: string | string[];
  subject: string;
  html: string;
};

function getFromAddress() {
  const from = process.env.RESEND_FROM_EMAIL;

  if (!from) {
    throw new Error("RESEND_FROM_EMAIL is not set.");
  }

  return `NextAdmin <${from}>`;
}

async function sendEmail({ to, subject, html }: SendEmailParams) {
  const from = getFromAddress();

  const { data, error } = await resend.emails.send({
    from,
    to,
    subject,
    html,
  });

  if (error) {
    throw error;
  }

  return data;
}

type SendTemplateEmailParams = {
  to: string | string[];
  subject: string;
  templateId: string;
  variables: Record<string, string>;
};

async function sendTemplateEmail({
  to,
  subject,
  templateId,
  variables,
}: SendTemplateEmailParams) {
  const from = getFromAddress();

  const { data, error } = await resend.emails.send({
    from,
    to,
    subject,
    template: {
      id: templateId,
      variables,
    },
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function sendVerificationEmail(params: {
  name: string;
  email: string;
  code: string;
  link: string;
}) {
  const templateId = process.env.RESEND_EMAIL_VERIFICATION_TEMPLATE_ID;

  if (!templateId) {
    throw new Error("RESEND_EMAIL_VERIFICATION_TEMPLATE_ID is not set.");
  }

  return await sendTemplateEmail({
    to: params.email,
    subject: "Verify your email",
    templateId,
    variables: {
      NAME: params.name,
      CODE: params.code,
      VERIFICATION_LINK: params.link,
    },
  });
}

export async function sendResetPasswordEmail(params: {
  name: string;
  email: string;
  link: string;
}) {
  const templateId = process.env.RESEND_PASSWORD_RESET_TEMPLATE_ID;

  if (!templateId) {
    throw new Error("RESEND_PASSWORD_RESET_TEMPLATE_ID is not set.");
  }

  return await sendTemplateEmail({
    to: params.email,
    subject: "Reset your password",
    templateId,
    variables: {
      NAME: params.name,
      RESET_LINK: params.link,
    },
  });
}
