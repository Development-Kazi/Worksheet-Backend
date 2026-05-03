import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.post(
  "/image",
  upload.single("file"),
  (req, res) => {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const baseUrl = process.env.IMAGE_BASE_URL || "";
    const relativePath = req.file.path.replace(/^\.\/public/, "");
    const url = `${baseUrl}${relativePath}`.replace(/\\/g, "/");

    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      data: { url },
    });
  },
);

router.post(
  "/file",
  upload.single("file"),
  (req, res) => {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const baseUrl = process.env.IMAGE_BASE_URL || "";
    const relativePath = req.file.path.replace(/^\.\/public/, "");
    const url = `${baseUrl}${relativePath}`.replace(/\\/g, "/");

    return res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      data: { url },
    });
  },
);

export default router;

