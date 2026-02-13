import { Router } from "express";
import { router as usersRoutes } from "./users.routes.js";
import { router as booksRoutes } from "./books.routes.js";

export const router = Router();

router.use("/users", usersRoutes);
router.use("/books", booksRoutes);
