import { Router } from "express";
import {
  loginAdmin,
  logoutAdmin,
  registerAdmin,
  refreshAccessToken,
  getAllAdmins,
  createSubAdmin,
  getAdminById,
  checkAdminById,
  changeAdminPassword,
} from "../controllers/admin.controller.js";
import { verifyJWTAdmin } from "../middlewares/admin.middleware.js";

const router = Router();

router
  .route("/login")
  .post(loginAdmin)
  .all((req, res) =>
    res.status(405).json({ success: false, message: "Method Not Allowed" }),
  );

//secured routes
router
  .route("/logout")
  .post(verifyJWTAdmin, logoutAdmin)
  .all((req, res) =>
    res.status(405).json({ success: false, message: "Method Not Allowed" }),
  );
router
  .route("/refresh-token")
  .post(refreshAccessToken)
  .all((req, res) =>
    res.status(405).json({ success: false, message: "Method Not Allowed" }),
  );
router
  .route("/all")
  .get(verifyJWTAdmin, getAllAdmins)
  .all((req, res) =>
    res.status(405).json({ success: false, message: "Method Not Allowed" }),
  );

router
  .route("/create/subadmin")
  .post(verifyJWTAdmin, createSubAdmin)
  .all((req, res) =>
    res.status(405).json({ success: false, message: "Method Not Allowed" }),
  );
router
  .route("/change-password")
  .put(verifyJWTAdmin, changeAdminPassword)
  .all((req, res) =>
    res.status(405).json({ success: false, message: "Method Not Allowed" }),
  );
router
  .route("/check/:id")
  .get(verifyJWTAdmin, checkAdminById)
  .all((req, res) =>
    res.status(405).json({ success: false, message: "Method Not Allowed" }),
  );
router
  .route("/:id")
  .get(verifyJWTAdmin, getAdminById)
  .all((req, res) =>
    res.status(405).json({ success: false, message: "Method Not Allowed" }),
  );

export default router;
