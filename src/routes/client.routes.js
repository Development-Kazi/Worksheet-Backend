import { Router } from "express";
import categoryClientRouter from "./client/category.client.routes.js";
import sitePageClientRouter from "./client/sitePage.client.routes.js";
import worksheetClientRouter from "./client/worksheet.client.routes.js";

const router = Router();

router.use("/category", categoryClientRouter);
router.use("/site-page", sitePageClientRouter);
router.use("/worksheet", worksheetClientRouter);

export default router;
