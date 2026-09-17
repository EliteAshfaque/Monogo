const nodemailer = require("nodemailer");

function getTransporter() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) return null;
  return nodemailer.createTransport({ host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT || 587), secure: process.env.SMTP_SECURE === "true", auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS.replace(/\s/g, "") } });
}

async function sendResetPasswordEmail({ to, username, resetUrl }) {
  const transporter = getTransporter();
  if (!transporter) throw new Error("Email is not configured");
  await transporter.sendMail({ from: process.env.EMAIL_FROM || process.env.SMTP_USER, to, subject: "Reset your Sonora password", text: `Hi ${username}, reset your password here: ${resetUrl}. This link expires in 1 hour.`, html: `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:32px;color:#162015"><h1 style="color:#4b6b11">Sonora</h1><h2>Reset your password</h2><p>Hi ${username}, we received a request to reset your password.</p><p><a href="${resetUrl}" style="display:inline-block;background:#d3ff4f;color:#17200e;padding:12px 20px;border-radius:24px;text-decoration:none;font-weight:bold">Reset password</a></p><p>This link expires in one hour. If you did not request this, you can safely ignore this email.</p></div>` });
}
module.exports = { sendResetPasswordEmail };
