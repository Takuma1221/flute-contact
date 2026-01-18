import nodemailer from "nodemailer";

interface SendMailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export async function sendMail({ to, subject, text, html }: SendMailOptions) {
  // Gmail SMTPトランスポーターの作成
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.GMAIL_USER, // 環境変数で指定、なければGmailアカウント
      to,
      subject,
      text,
      html,
    });

    console.log("Email sent successfully using Gmail SMTP:", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email via Gmail SMTP:", error);
    return false;
  }
}
