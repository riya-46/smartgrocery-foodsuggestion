import express from "express";
import Transaction from "../models/Transaction.js";

const router = express.Router();

/* ADD ITEM */
router.post("/add", async (req, res) => {
  try {
    await Transaction.create(req.body);
    res.json({ success: true });
  } catch (err) {
    console.error("ADD ITEM ERROR:", err);
    res.status(500).json({ success: false });
  }
});

/* UPDATE ITEM */
router.put("/update/:id", async (req, res) => {
  try {
    await Transaction.findByIdAndUpdate(req.params.id, req.body);
    res.json({ success: true });
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ success: false });
  }
});

/* GET ITEMS (EMAIL BASED) */
router.get("/get/:email", async (req, res) => {
  try {
    const items = await Transaction.find({
      userEmail: req.params.email
    });
    res.json(items);
  } catch (err) {
    console.error("GET ITEMS ERROR:", err);
    res.status(500).json([]);
  }
});

/* DELETE ITEM */
router.delete("/delete/:id", async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ success: false });
  }
});

export default router;
