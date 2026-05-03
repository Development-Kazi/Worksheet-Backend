import { Router } from "express";
import { getPublicSitePage } from "../../controllers/sitePage.controller.js";

const router = Router();

router
  .route("/:key")
  .get(getPublicSitePage)
  .all((req, res) =>
    res.status(405).json({ success: false, message: "Method Not Allowed" }),
  );

export default router;
