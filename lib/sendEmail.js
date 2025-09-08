import axios from "axios";

export const sendEmail = async (to, code) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { name: "UrlShorter", email: process.env.EMAIL_FROM },
        to: [{ email: to }],
        subject: "🔒 Password Reset Code",
        htmlContent: `
          <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
            <h2>🔑 Password Reset Request</h2>
            <p>Your reset code is:</p>
            <h3 style="background:#0C67A0;color:white;padding:10px;border-radius:5px">${code}</h3>
            <p>This code expires in <b>10 minutes</b>.</p>
          </div>
        `,
      },
      {
        headers: {
          "accept": "application/json",
          "api-key": process.env.BREVO_API_KEY,
          "content-type": "application/json",
        },
      }
    );


  } catch (error) {
    console.error(
      "❌ Error sending email via Brevo API:",
      error.response?.data || error.message
    );
    throw new Error("Email sending failed");
  }
};
