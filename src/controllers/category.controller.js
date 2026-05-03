import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Category } from "../models/category.model.js";
import { Worksheet } from "../models/warehouse.model.js";

const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({}).sort({
    order: 1,
    createdAt: -1,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, categories, "Categories fetched successfully"));
});

const getPublicCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ status: { $ne: "deleted" } }).sort({
    order: 1,
    createdAt: -1,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, categories, "Public categories fetched successfully"));
});

const createCategory = asyncHandler(async (req, res) => {
  const {
    name,
    slug,
    parent,
    order = 0,
    image,
    icon,
    status = "active",
    metaTitle,
    metaDescription,
    metaKeywords,
  } = req.body;

  if (!name || String(name).trim() === "") {
    throw new ApiError(400, "Category name is required");
  }

  const category = await Category.create({
    name: String(name).trim(),
    slug: slug ? String(slug).trim() : undefined,
    parent: parent || null,
    order: Number(order) || 0,
    image,
    icon,
    status,
    metaTitle,
    metaDescription,
    metaKeywords,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, category, "Category created successfully"));
});

const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = { ...req.body };

  if (updates.name !== undefined && String(updates.name).trim() === "") {
    throw new ApiError(400, "Category name cannot be empty");
  }

  if (updates.parent === "") updates.parent = null;

  const category = await Category.findByIdAndUpdate(id, updates, { new: true });
  if (!category) throw new ApiError(404, "Category not found");

  return res
    .status(200)
    .json(new ApiResponse(200, category, "Category updated successfully"));
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const rootCategory = await Category.findById(id);
  if (!rootCategory) throw new ApiError(404, "Category not found");

  const allCategories = await Category.find({});
  const childrenMap = {};
  allCategories.forEach((cat) => {
    const parentId = cat.parent ? String(cat.parent) : "";
    if (!parentId) return;
    if (!childrenMap[parentId]) childrenMap[parentId] = [];
    childrenMap[parentId].push(String(cat._id));
  });

  const categoryIdsToDelete = [];
  const queue = [String(id)];

  while (queue.length) {
    const current = queue.shift();
    categoryIdsToDelete.push(current);
    const children = childrenMap[current] || [];
    children.forEach((childId) => queue.push(childId));
  }

  await Category.updateMany(
    { _id: { $in: categoryIdsToDelete } },
    { $set: { status: "deleted" } },
  );

  await Worksheet.updateMany(
    { category: { $in: categoryIdsToDelete } },
    { $set: { status: "deleted" } },
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { categoryIdsToDelete, worksheetsSoftDeleted: true },
        "Category and linked data marked as deleted",
      ),
    );
});

export {
  getAllCategories,
  getPublicCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};

