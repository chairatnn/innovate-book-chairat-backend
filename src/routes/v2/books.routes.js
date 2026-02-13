import { Router } from "express";
import {
  createBook2,
  deleteBook2,
  getBook2,
  getBooks2,
  updateBook2,
} from "../../modules/books/books.controller.js";
import { Book } from "../../modules/books/books.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authUser } from "../../middlewares/auth.js";

export const router = Router();

router.get("/", getBooks2);

// Check user authentication (check if user has valid token)
router.get("/auth/cookie/me", authUser, async (req, res, next) => {
  try {
    const userId = req.user.user._id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({
        error: true,
        message: "Unauthenticated",
      });
    }

    res.status(200).json({
      error: false,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", getBook2);

router.post("/", authUser, createBook2);

router.delete("/:id", authUser, deleteBook2);

router.patch("/:id", authUser, updateBook2);

// Login a user - jwt signed token (token in cookies)
router.post("/auth/cookie/login", async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: true,
      message: "Email and Password are required...",
    });
  }

  try {
    const normalizedEmail = String(email).trim().toLowerCase();

    const book = await Book.findOne({ email: normalizedEmail }).select(
      "+password",
    );

    if (!book) {
      return res.status(401).json({
        error: true,
        message: "User not found...",
      });
    }

    const isMatched = await bcrypt.compare(password, book.password);

    if (!isMatched) {
      return res.status(401).json({
        error: true,
        message: "Invalid password...",
      });
    }
    // Generate JSON Web Token
    const token = jwt.sign({ bookId: book._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const isProd = process.env.NODE_ENV === "production";

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.status(200).json({
      error: false,
      message: "Login successful",
      token: token,
      user: {
        _id: book._id,
        title: book.title,
        author: book.author,
        year: book.year,
        genre: book.genre,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Logout a user
router.post("/auth/cookie/logout", (req, res) => {
  const isProd = process.env.NODE_ENV === "production";

  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
  });

  res.status(200).json({
    error: false,
    message: "Logged out successfully",
  });
});
