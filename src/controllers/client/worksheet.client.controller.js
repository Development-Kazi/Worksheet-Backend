import { Worksheet } from "../../models/warehouse.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const getClientWorksheets = asyncHandler(async (req, res) => {
  const worksheets = await Worksheet.find({ status: "active" })
    .populate("category", "name slug parent")
    .select("title subTitle slug price discountedPrice rating description includes category fileUrl thumbnail icon author authorImage publishedDate tags status metaTitle metaDescription")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, worksheets, "Client worksheets fetched successfully"));
});

export { getClientWorksheets };
