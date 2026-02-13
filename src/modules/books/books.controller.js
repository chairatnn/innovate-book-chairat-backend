import { Book } from "./books.model.js";

// 🟢 API v2
// ✅ route handler: GET a single book by id from the database
export const getBook2 = async (req, res, next) => {
  const { id } = req.params;

  try {
    const doc = await Book.findById(id).select("-password");
    if (!doc) {
      const error = new Error("User not found");
      return next(error);
    }
    return res.status(200).json({
      success: true,
      data: doc,
    });
  } catch (error) {
    error.status = 500;
    error.name = error.name || "DatabaseError";
    error.message = error.message || "Failed to get a user";
    return next(error);
  }
};

// ✅ route handler: get all books from the database
export const getBooks2 = async (req, res, next) => {
  try {
    const books = await Book.find().select("-password");
    return res.status(200).json({
      success: true,
      data: books,
    });
  } catch (error) {
    // error.name = error.name || "DatabaseError";
    // error.status = 500;
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

    const safe = doc.toObject();
    delete safe.password;

    return res.status(201).json({
      success: true,
      data: safe,
    });
  } catch (error) {
    if (error.code === 11000) {
      error.status = 409;
      error.name = "DuplicateKeyError";
      error.message = "Email already in use";
    }
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
    const updated = await Book.findByIdAndUpdate(id, body);

    if (!updated) {
      const error = new Error("Book not found...");

      return next(error);
    }

    const safe = updated.toObject();
    delete safe.password;

    return res.status(200).json({
      success: true,
      data: safe,
    });
  } catch (error) {
    if (error.code === 11000) {
      return next(error);
    }
    return next(error);
  }
};

