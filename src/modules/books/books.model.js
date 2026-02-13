import mongoose from "mongoose";

// a data model is created from a data schema

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "กรุณากรอกชื่อหนังสือ"],
      trim: true,
    },
    author: {
      type: String,
      required: [true, "กรุณากรอกชื่อผู้แต่ง"],
      trim: true,
    },
    year: {
      type: Number,
      required: [true, "กรุณากรอกปีที่พิมพ์"],
      // หมายเหตุ: Number ไม่รองรับ trim: true
    },
    genre: {
      type: String,
      required: [true, "กรุณากรอกประเภทหนังสือ"],
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

// mongodb will automatically create books collection

export const Book = mongoose.model("Book", bookSchema);
