// import { TransactionalEmailsApi, TransactionalEmailsApiApiKeys, SendSmtpEmail, CreateSmtpEmail } from "@getbrevo/brevo";
import { TransactionalEmailsApi, TransactionalEmailsApiApiKeys, SendSmtpEmail, CreateSmtpEmail } from "@getbrevo/brevo";
import { config } from "./env.js";
import { AppError } from "../appErr.js";

type SendEmailParams = {
  to: string;
  subject: string;
  html?: string;
  textContent?: string;
};

export const sendEmail = async ({
  to,
  subject,
  html,
  textContent,
}: SendEmailParams): Promise<CreateSmtpEmail> => {
  const senderEmail = config.BREVO_SENDER_EMAIL;
  const apiKey = config.BREVO_API_KEY;

  if (!apiKey) {
    throw new AppError("BREVO_API_KEY is not defined in .env", 500);
  }
  if (!senderEmail) {
    throw new AppError("BREVO_SENDER_EMAIL is not defined in .env", 500);
  }

  // Diagnostics: Log first 5 chars of API key (SAFE)
  const cleanApiKey = apiKey.trim();

  // Initialize Brevo API
  const brevo = new TransactionalEmailsApi();
  try {
    brevo.setApiKey(TransactionalEmailsApiApiKeys.apiKey, cleanApiKey);
  } catch (err) {
    throw new AppError(`Brevo Error: Request rejected`, 500);
  }

  // Thorough sanitization for .env values that might have quotes (e.g. from copy-paste)
  const cleanSenderEmail = senderEmail.replace(/['"]/g, '').trim();
  const cleanSenderName = (config.BREVO_SENDER_NAME || "Gudang Seragam").replace(/['"]/g, '').trim();

  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleanSenderEmail)) {
    throw new AppError(`Invalid Sender Email: ${cleanSenderEmail}`, 500);
  }


  const sendSmtpEmail = new SendSmtpEmail();
  sendSmtpEmail.subject = subject;
  sendSmtpEmail.sender = {
    name: cleanSenderName,
    email: cleanSenderEmail,
  };
  sendSmtpEmail.to = [{ email: to }];
  sendSmtpEmail.htmlContent = html || "";
  sendSmtpEmail.textContent = textContent || "";
  sendSmtpEmail.replyTo = {
    email: cleanSenderEmail
  };
  
  try {
    const result = await brevo.sendTransacEmail(sendSmtpEmail);
    return result.body;
  } catch (error: any) {
    throw new AppError(`Brevo Error: Request rejected`, 500);
  }
};




