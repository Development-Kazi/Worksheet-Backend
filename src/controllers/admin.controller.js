import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Admin } from "../models/admin.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

const generateAccessAndRefereshTokens = async (adminId) => {
  try {
    const admin = await Admin.findById(adminId);
    const accessToken = admin.generateAccessToken();
    const refreshToken = admin.generateRefreshToken();

    admin.refreshToken = refreshToken;
    await admin.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token",
    );
  }
};

const registerAdmin = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;
  if (!username || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }
  if ([email, username, password].some((field) => field?.trim() == "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existedAdmin = await Admin.findOne({
    $or: [{ username }, { email }],
    status: { $ne: "deleted" },
  });

  if (existedAdmin) {
    throw new ApiError(409, "Admin with email or username already exists");
  }

  const uid = uuidv4();
  const admin = await Admin.create({
    uid,
    email,
    password,
    username,
    type: "admin",
    createdBy: "System",
  });

  const createdAdmin = await Admin.findById(admin._id).select(
    "-password -refreshToken",
  );

  if (!createdAdmin) {
    throw new ApiError(500, "Something went wrong while registering the admin");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdAdmin, "Admin registered Successfully"));
});

const registerSubAdmin = asyncHandler(async (req, res) => {
  if (req.admin.createdBy != "System") {
    throw new ApiError(400, "Only System can create subAdmin");
  }
  const { email, username, password, role } = req.body;

  if (!username || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const existedSubAdmin = await Admin.findOne({
    $or: [{ username }, { email }],
    status: { $ne: "deleted" },
  });

  if (existedSubAdmin) {
    throw new ApiError(409, "SubAdmin with email or username already exists");
  }
  const uid = uuidv4();
  const subAdmin = await Admin.create({
    uid,
    email,
    password,
    username,
    createdBy: req.admin.uid,
    type: "subAdmin",
  });

  const createdSubAdmin = await Admin.findById(subAdmin._id).select(
    "-password -refreshToken",
  );

  if (!createdSubAdmin) {
    throw new ApiError(
      500,
      "Something went wrong while registering the subAdmin",
    );
  }

  return res
    .status(201)
    .json(
      new ApiResponse(200, createdSubAdmin, "SubAdmin registered Successfully"),
    );
});

const createSubAdmin = asyncHandler(async (req, res) => {
  const { email, username, password, access } = req.body;

  if (!username || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const existedSubAdmin = await Admin.findOne({
    $or: [{ username }, { email }],
    status: { $ne: "deleted" },
  });

  if (existedSubAdmin) {
    throw new ApiError(409, "SubAdmin with email or username already exists");
  }

  const uid = uuidv4();
  const subAdmin = await Admin.create({
    uid,
    email,
    password,
    username,
    access: JSON.parse(access) || [],
    createdBy: req.admin.uid,
    type: "subAdmin",
  });

  const createdSubAdmin = await Admin.findById(subAdmin._id).select(
    "-password -refreshToken",
  );

  if (!createdSubAdmin) {
    throw new ApiError(
      500,
      "Something went wrong while registering the subAdmin",
    );
  }

  return res
    .status(201)
    .json(
      new ApiResponse(200, createdSubAdmin, "SubAdmin registered Successfully"),
    );
});

const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const admin = await Admin.findOne({ email, status: "active" });
  if (!admin) {
    throw new ApiError(404, "Admin does not exist");
  }

  const isPasswordValid = await admin.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid admin credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    admin._id,
  );

  const options = {
    httpOnly: true,
    secure: true,
    domain: process.env.FRONTEND_DOMAIN,
    path: "/",
    sameSite: "None",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          // admin: loggedInAdmin
        },
        "Admin logged In Successfully",
      ),
    );
});

const logoutAdmin = asyncHandler(async (req, res) => {
  await Admin.findByIdAndUpdate(
    req.admin._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    },
  );

  const options = {
    httpOnly: true,
    secure: true,
    domain: process.env.FRONTEND_DOMAIN,
    path: "/",
    sameSite: "None",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "Admin logged Out"));
});

const getAllAdmins = asyncHandler(async (req, res) => {
  const admins = await Admin.find({ status: { $ne: "deleted" } }).select(
    "-password -refreshToken",
  );
  return res
    .status(200)
    .json(new ApiResponse(200, admins, "Admins fetched successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );

    const admin = await Admin.findById(decodedToken?._id);

    if (!admin) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== admin?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefereshTokens(admin._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed",
        ),
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

// From View
const getAdminById = asyncHandler(async (req, res) => {
  const admin = await Admin.findOne({
    _id: req.params.id,
    status: { $ne: "deleted" },
  }).select("-password -refreshToken");

  if (!admin) {
    throw new ApiError(404, "Admin not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, admin, "Admin fetched successfully"));
});

const checkAdminById = asyncHandler(async (req, res) => {
  // only find status active
  const admin = await Admin.findOne(
    {
      _id: req.params.id,
      status: { $ne: "deleted" },
    },
    "status",
  );
  console.log(admin);
  console.log(req.params.id);

  if (!admin) {
    return res
      .status(200)
      .json(new ApiResponse(200, { active: false }, "Admin Not found "));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { active: true }, "Admin fetched successfully"));
});

const changeAdminPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (!oldPassword || !newPassword || !confirmPassword) {
    throw new ApiError(400, "Old password, new password and confirm password are required");
  }

  if (String(newPassword).trim().length < 6) {
    throw new ApiError(400, "New password must be at least 6 characters");
  }

  if (newPassword !== confirmPassword) {
    throw new ApiError(400, "New password and confirm password do not match");
  }

  const admin = await Admin.findById(req.admin?._id);
  if (!admin || admin.status === "deleted") {
    throw new ApiError(404, "Admin not found");
  }

  const isOldPasswordValid = await admin.isPasswordCorrect(oldPassword);
  if (!isOldPasswordValid) {
    throw new ApiError(401, "Old password is incorrect");
  }

  admin.password = String(newPassword).trim();
  await admin.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

export {
  registerAdmin,
  loginAdmin,
  getAllAdmins,
  logoutAdmin,
  registerSubAdmin,
  createSubAdmin,
  refreshAccessToken,
  getAdminById,
  checkAdminById,
  changeAdminPassword,
};
