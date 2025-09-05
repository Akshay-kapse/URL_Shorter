import nodemailer from "nodemailer";

export const sendEmail = async (to, code) => {
  try {
    console.log("📩 Using Brevo SMTP User:", process.env.EMAIL_USER);

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST, // smtp-relay.brevo.com
      port: process.env.EMAIL_PORT, // 587
      secure: false, // TLS
      auth: {
        user: process.env.EMAIL_USER, // 965b49001@smtp-brevo.com
        pass: process.env.EMAIL_PASS, // your Brevo SMTP password
      },
    });

    await transporter.sendMail({
      from: `"UrlShorter" <${process.env.EMAIL_FROM}>`, // Verified sender in Brevo
      to,
      subject: "🔒 Password Reset Code",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
          <h2>🔑 Password Reset Request</h2>
          <p>Your reset code is:</p>
          <h3 style="background:#0C67A0;color:white;padding:10px;border-radius:5px">${code}</h3>
          <p>This code expires in <b>10 minutes</b>.</p>
        </div>
      `,
    });

    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw new Error("Email sending failed");
  }
};
