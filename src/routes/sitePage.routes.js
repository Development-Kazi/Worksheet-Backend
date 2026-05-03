import { Router } from "express";
import { verifyJWTAdmin } from "../middlewares/admin.middleware.js";
import { getAllSitePages, updateSitePage } from "../controllers/sitePage.controller.js";

const router = Router();

router
  .route("/all")
  .get(verifyJWTAdmin, getAllSitePages)
  .all((req, res) =>
    res.status(405).json({ success: false, message: "Method Not Allowed" }),
  );

router
  .route("/:key")
  .put(verifyJWTAdmin, updateSitePage)
  .all((req, res) =>
    res.status(405).json({ success: false, message: "Method Not Allowed" }),
  );

export default router;
