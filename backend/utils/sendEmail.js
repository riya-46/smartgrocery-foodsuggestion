import nodemailer from "nodemailer";

/**
 * Send OTP email to user
 * @param {string} email - Receiver email
 * @param {string | number} otp - Generated OTP
 */
export const sendOtpEmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Smart Grocery App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "OTP Verification - Smart Grocery App",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Email Verification</h2>
          <p>Your OTP is:</p>
          <h1 style="letter-spacing: 2px;">${otp}</h1>
          <p>This OTP is valid for <b>5 minutes</b>.</p>
          <p>If you did not request this, please ignore this email.</p>
        </div>
      `,
    });

    console.log("✅ OTP email sent to:", email);
  } catch (error) {
    console.error("❌ EMAIL SEND ERROR:", error);
    throw new Error("Failed to send OTP email");
  }
};
