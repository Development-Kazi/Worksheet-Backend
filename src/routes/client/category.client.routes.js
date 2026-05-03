import { Router } from "express";
import { getClientCategories } from "../../controllers/client/category.client.controller.js";

const router = Router();

router
  .route("/all")
  .get(getClientCategories)
  .all((req, res) =>
    res.status(405).json({ success: false, message: "Method Not Allowed" }),
  );

export default router;
