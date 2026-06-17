import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;

if (!apiKey) {
  console.error("[email] RESEND_API_KEY is missing");
  throw new Error("RESEND_API_KEY is not set.");
}

export const resend = new Resend(apiKey);
