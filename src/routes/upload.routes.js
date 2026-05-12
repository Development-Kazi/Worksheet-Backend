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

    const baseUrl = process.env.IMAGE_BASE_URL || "http://localhost:8000";
    // Normalize path for all OSes and remove the 'public' prefix
    let relativePath = req.file.path.replace(/\\/g, "/");
    relativePath = relativePath.replace(/^public\//, "/").replace(/^\.\/public\//, "/");
    
    // Ensure relativePath starts with exactly one slash
    if (!relativePath.startsWith("/")) relativePath = "/" + relativePath;
    
    const url = `${baseUrl}${relativePath}`;

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

    const baseUrl = process.env.IMAGE_BASE_URL || "http://localhost:8000";
    let relativePath = req.file.path.replace(/\\/g, "/");
    relativePath = relativePath.replace(/^public\//, "/").replace(/^\.\/public\//, "/");
    
    if (!relativePath.startsWith("/")) relativePath = "/" + relativePath;

    const url = `${baseUrl}${relativePath}`;

    return res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      data: { url },
    });
  },
);

export default router;

