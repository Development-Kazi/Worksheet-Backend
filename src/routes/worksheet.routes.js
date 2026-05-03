import { Router } from "express";
import { verifyJWTAdmin } from "../middlewares/admin.middleware.js";
import {
  createWorksheet,
  deleteWorksheet,
  getAllWorksheets,
  getPublicWorksheets,
  updateWorksheet,
} from "../controllers/worksheet.controller.js";

const router = Router();

router
  .route("/public/all")
  .get(getPublicWorksheets)
  .all((req, res) =>
    res.status(405).json({ success: false, message: "Method Not Allowed" }),
  );

router
  .route("/all")
  .get(verifyJWTAdmin, getAllWorksheets)
  .all((req, res) =>
    res.status(405).json({ success: false, message: "Method Not Allowed" }),
  );

router
  .route("/create")
  .post(verifyJWTAdmin, createWorksheet)
  .all((req, res) =>
    res.status(405).json({ success: false, message: "Method Not Allowed" }),
  );

router
  .route("/:id")
  .put(verifyJWTAdmin, updateWorksheet)
  .delete(verifyJWTAdmin, deleteWorksheet)
  .all((req, res) =>
    res.status(405).json({ success: false, message: "Method Not Allowed" }),
  );

export default router;

