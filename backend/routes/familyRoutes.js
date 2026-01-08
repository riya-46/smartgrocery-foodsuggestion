import express from "express";
import FamilyMember from "../models/FamilyMember.js";

const router = express.Router();

// Add member
router.post("/", async (req, res) => {
  try {
    const member = new FamilyMember(req.body);
    await member.save();
    res.json(member);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all members
router.get("/", async (req, res) => {
  try {
    const members = await FamilyMember.find().sort({ createdAt: -1 });
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update member
router.put("/:id", async (req, res) => {
  try {
    const updated = await FamilyMember.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete member
router.delete("/:id", async (req, res) => {
  try {
    await FamilyMember.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
