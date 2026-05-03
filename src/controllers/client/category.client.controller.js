import { Category } from "../../models/category.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const getClientCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ status: "active" })
    .select("name slug parent order image icon status metaTitle metaDescription")
    .sort({ order: 1, createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, categories, "Client categories fetched successfully"));
});

export { getClientCategories };
