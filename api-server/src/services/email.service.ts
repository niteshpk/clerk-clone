import nodemailer from "nodemailer";
import crypto from "crypto";

const transporter = nodemailer.createTransport({
  host: "localhost",
  port: 1025,
  secure: false,
  ignoreTLS: true, // Required for local MailHog setup
} as nodemailer.TransportOptions);

export const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: "noreply@clerk-clone.com",
    to: email,
    subject: "Verify your email",
    html: `
      <h1>Welcome to Clerk Clone!</h1>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationUrl}">Verify Email</a>
      <p>This link will expire in 24 hours.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
