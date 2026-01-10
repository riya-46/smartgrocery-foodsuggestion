import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
//import Otp from "../models/Otp.js";
//import { sendOtpEmail } from "../utils/sendEmail.js";

const router = express.Router();


/* ================= SEND OTP ================= 
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.json({ success: false, message: "Email required" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "Email already registered" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.deleteMany({ email });

    await Otp.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    await sendOtpEmail(email, otp);

    res.json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "OTP failed" });
  }
});*/

/* ========== VERIFY OTP & REGISTER ========== 
router.post("/verify-otp", async (req, res) => {
  const { name, email, password, otp } = req.body;

  const record = await Otp.findOne({ email, otp });
  if (!record) {
    return res.json({ success: false, message: "Invalid OTP" });
  }

  if (record.expiresAt < new Date()) {
    await Otp.deleteMany({ email });
    return res.json({ success: false, message: "OTP expired" });
  }

  const hashed = await bcrypt.hash(password, 10);

  await User.create({
    name,
    email,
    password: hashed,
  });

  await Otp.deleteMany({ email });

  res.json({ success: true, message: "Registration successful" });
});
*/

/* ================= LOGIN (JWT) ================= */
router.post("/login", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.json({ success: false, message: "Email required" });
    }

    let user = await User.findOne({ email });

    // 🔥 AUTO CREATE USER IF NOT EXISTS
    if (!user) {
      user = await User.create({
        email,
        name: email.split("@")[0],
      });
    }

    res.json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


export default router;
