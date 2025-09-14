import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// verify connection
transporter.verify((err, success) => {
  if (err) {
    console.error(" SMTP error:", err);
  } else {
    console.log(" Mailtrap SMTP server is ready to send emails");
  }
});

export const sendMail = async (to, subject, html) => {
  return transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject,
    html,
  });
};
