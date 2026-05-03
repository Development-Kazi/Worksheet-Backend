import { Router } from "express";
import { getClientWorksheets } from "../../controllers/client/worksheet.client.controller.js";

const router = Router();

router
  .route("/all")
  .get(getClientWorksheets)
  .all((req, res) =>
    res.status(405).json({ success: false, message: "Method Not Allowed" }),
  );

export default router;
