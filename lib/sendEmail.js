import nodemailer from "nodemailer";

export const sendEmail = async (to, code) => {
  try {
    console.log("📩 Using EMAIL_USER:", process.env.EMAIL_USER); // debug

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"UrlShorter" <${process.env.EMAIL_USER}>`,
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
