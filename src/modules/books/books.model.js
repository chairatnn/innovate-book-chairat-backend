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
      // 1. ตรวจสอบค่าบวก (ต้องไม่น้อยกว่า 1)
      min: [1, "ปีที่พิมพ์ต้องเป็นค่าบวกเท่านั้น"],
      // 2. ตรวจสอบว่าต้องไม่เกินปีปัจจุบัน
      validate: {
        validator: function(value) {
          const currentYear = new Date().getFullYear();
          return value <= currentYear;
        },
        message: props => `ปีที่พิมพ์ (${props.value}) ต้องไม่เกินปีปัจจุบัน (${new Date().getFullYear()})`
      }
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
