import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Worksheet } from "../models/warehouse.model.js";

const getAllWorksheets = asyncHandler(async (req, res) => {
  const worksheets = await Worksheet.find({})
    .populate("category", "name slug parent")
    .sort({ createdAt: -1 });
  return res
    .status(200)
    .json(new ApiResponse(200, worksheets, "Worksheets fetched successfully"));
});

const getPublicWorksheets = asyncHandler(async (req, res) => {
  const worksheets = await Worksheet.find({ status: { $ne: "deleted" } })
    .populate("category", "name slug parent")
    .sort({ createdAt: -1 });
  return res
    .status(200)
    .json(new ApiResponse(200, worksheets, "Public worksheets fetched successfully"));
});

const createWorksheet = asyncHandler(async (req, res) => {
  const {
    title,
    subTitle,
    slug,
    price,
    discountedPrice,
    rating,
    description,
    includes,
    category,
    fileUrl,
    thumbnail,
    icon,
    author,
    authorImage,
    publishedDate,
    tags,
    metaTitle,
    metaDescription,
    metaKeywords,
    status = "active",
  } = req.body;

  if (!title || String(title).trim() === "") {
    throw new ApiError(400, "Worksheet title is required");
  }

  const worksheet = await Worksheet.create({
    title: String(title).trim(),
    subTitle,
    slug: slug ? String(slug).trim() : undefined,
    price: price !== undefined ? Number(price) : undefined,
    discountedPrice: discountedPrice !== undefined ? Number(discountedPrice) : undefined,
    rating: rating !== undefined ? Number(rating) : undefined,
    description,
    includes,
    category: category || null,
    fileUrl,
    thumbnail,
    icon,
    author,
    authorImage,
    publishedDate,
    tags: Array.isArray(tags)
      ? tags
      : typeof tags === "string"
        ? tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
    metaTitle,
    metaDescription,
    metaKeywords,
    status,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, worksheet, "Worksheet created successfully"));
});

const updateWorksheet = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = { ...req.body };

  if (updates.title !== undefined && String(updates.title).trim() === "") {
    throw new ApiError(400, "Worksheet title cannot be empty");
  }

  if (updates.tags && typeof updates.tags === "string") {
    updates.tags = updates.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }

  const worksheet = await Worksheet.findByIdAndUpdate(id, updates, { new: true });
  if (!worksheet) throw new ApiError(404, "Worksheet not found");

  return res
    .status(200)
    .json(new ApiResponse(200, worksheet, "Worksheet updated successfully"));
});

const deleteWorksheet = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deleted = await Worksheet.findByIdAndUpdate(
    id,
    { status: "deleted" },
    { new: true },
  );
  if (!deleted) throw new ApiError(404, "Worksheet not found");

  return res
    .status(200)
    .json(new ApiResponse(200, deleted, "Worksheet marked as deleted"));
});

export {
  getAllWorksheets,
  getPublicWorksheets,
  createWorksheet,
  updateWorksheet,
  deleteWorksheet,
};

