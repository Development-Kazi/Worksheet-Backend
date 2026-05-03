import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { Admin } from "../models/admin.model.js";

export const verifyJWTAdmin = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || req.headers["authorization"];

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const admin = await Admin.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!admin) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.admin = admin;
    next();
  } catch (error) {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});
