import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    userEmail: String,
    itemName: String,
    quantity: Number,
    unit: String,
    price: Number,
    category: String,
    mode: String,
    date: String
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);
