import { Book } from "./books.model.js";

// 🟢 API v2
// ✅ route handler: GET a single book by id from the database
export const getBook2 = async (req, res, next) => {
  const { id } = req.params;

  try {
    const doc = await Book.findById(id);
    if (!doc) {
      const error = new Error("Book not found");
      error.status = 404;
      return next(error);
    }
    return res.status(200).json({
      success: true,
      data: doc,
    });
  } catch (error) {
    error.status = 500;
    error.name = error.name || "DatabaseError";
    error.message = error.message || "Failed to get a book";
    return next(error);
  }
};

// ✅ route handler: get all books from the database (PAGINATION)
export const getBooks2 = async (req, res, next) => {
  try {
     // 1. รับค่าจาก Query Params สำหรับ Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    // 2. คำนวณข้าม (skip) ตามสูตร: (หน้าปัจจุบัน - 1) * จำนวนต่อหน้า
    const skip = (page - 1) * limit;

    // 3. ดึงข้อมูลพร้อมทำ Pagination และนับจำนวนทั้งหมด
    // ใช้ Promise.all เพื่อรันคำสั่งพร้อมกันเพื่อความรวดเร็ว
    const [books, totalItems] = await Promise.all([
      Book.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Book.countDocuments()
    ]);

    // 4. คำนวณจำนวนหน้าทั้งหมด
    const totalPages = Math.ceil(totalItems / limit);

    return res.status(200).json({
      success: true,
      data: books,
      totalPages: totalPages,
      currentPage: page,
      totalItems: totalItems
    });
  } catch (error) {
    return next(error);
  }
};

// ✅ route handler: delete a book in the database
export const deleteBook2 = async (req, res, next) => {
  const { id } = req.params;
  try {
    const deleted = await Book.findByIdAndDelete(id);

    if (!deleted) {
      const error = new Error("Book not found");
      error.status = 404;
      return next(error);
    }

    return res.status(200).json({
      success: true,
      data: null,
    });
  } catch (error) {
    return next(error);
  }
};

// ✅ route handler: create a new book in the database
export const createBook2 = async (req, res, next) => {
  const { title, author, year, genre } = req.body;

  if (!title || !author || !year || !genre) {
    const error = new Error("title, author, year and genre are required");
    error.name = "ValidationError";
    error.status = 400;
    return next(error);
  }

  try {
    const doc = await Book.create({ title, author, year, genre });

    return res.status(201).json({
      success: true,
      data: doc,
    });
  } catch (error) {
    error.status = 500;
    error.name = error.name || "DatabaseError";
    error.message = error.message || "Failed to create a book";
    return next(error);
  }
};

// ✅ route handler: update a book in the database
export const updateBook2 = async (req, res, next) => {
  const { id } = req.params;
  const body = req.body;

  try {
    const updated = await Book.findByIdAndUpdate(id, body, { new: true});

    if (!updated) {
      const error = new Error("Book not found...");
      error.status = 404;
      return next(error);
    }

    return res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
      return next(error);
  }
};

