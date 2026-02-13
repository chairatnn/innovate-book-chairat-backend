import mongoose from "mongoose";
import bcrypt from "bcrypt";

// a data model is created from a data schema

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    year: { type: Number, required: true, trim: true },
    genre: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
bookSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// mongodb will automatically create books collection

export const Book = mongoose.model("Book", bookSchema);
