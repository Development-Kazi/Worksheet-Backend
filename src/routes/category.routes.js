import { Router } from "express";
import { verifyJWTAdmin } from "../middlewares/admin.middleware.js";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getPublicCategories,
  updateCategory,
} from "../controllers/category.controller.js";

const router = Router();

router
  .route("/public/all")
  .get(getPublicCategories)
  .all((req, res) =>
    res.status(405).json({ success: false, message: "Method Not Allowed" }),
  );

router
  .route("/all")
  .get(verifyJWTAdmin, getAllCategories)
  .all((req, res) =>
    res.status(405).json({ success: false, message: "Method Not Allowed" }),
  );

router
  .route("/create")
  .post(verifyJWTAdmin, createCategory)
  .all((req, res) =>
    res.status(405).json({ success: false, message: "Method Not Allowed" }),
  );

router
  .route("/:id")
  .put(verifyJWTAdmin, updateCategory)
  .delete(verifyJWTAdmin, deleteCategory)
  .all((req, res) =>
    res.status(405).json({ success: false, message: "Method Not Allowed" }),
  );

export default router;

