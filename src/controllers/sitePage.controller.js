import { SitePage } from "../models/sitePage.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const defaultPages = [
  {
    key: "about-us",
    title: "About Us",
    content: "",
    metaTitle: "About Us",
    metaDescription: "",
    metaKeywords: "",
    status: "active",
  },
  {
    key: "contact-us",
    title: "Contact Us",
    content: "",
    metaTitle: "Contact Us",
    metaDescription: "",
    metaKeywords: "",
    status: "active",
  },
  {
    key: "privacy-policy",
    title: "Privacy Policy",
    content: "",
    metaTitle: "Privacy Policy",
    metaDescription: "",
    metaKeywords: "",
    status: "active",
  },
];

const ensureDefaultPages = async () => {
  await Promise.all(
    defaultPages.map((page) =>
      SitePage.findOneAndUpdate(
        { key: page.key },
        { $setOnInsert: page },
        { upsert: true, new: true },
      ),
    ),
  );
};

const getAllSitePages = asyncHandler(async (req, res) => {
  await ensureDefaultPages();
  const pages = await SitePage.find({}).sort({ createdAt: 1 });
  return res
    .status(200)
    .json(new ApiResponse(200, pages, "Site pages fetched successfully"));
});

const getPublicSitePage = asyncHandler(async (req, res) => {
  await ensureDefaultPages();
  const { key } = req.params;
  const page = await SitePage.findOne({ key, status: { $ne: "deleted" } });

  if (!page) {
    throw new ApiError(404, "Site page not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, page, "Site page fetched successfully"));
});

const updateSitePage = asyncHandler(async (req, res) => {
  await ensureDefaultPages();
  const { key } = req.params;
  const updates = { ...req.body };

  if (updates.title !== undefined && String(updates.title).trim() === "") {
    throw new ApiError(400, "Page title cannot be empty");
  }

  const page = await SitePage.findOneAndUpdate(
    { key },
    {
      ...updates,
      title: updates.title !== undefined ? String(updates.title).trim() : updates.title,
    },
    { new: true },
  );

  if (!page) {
    throw new ApiError(404, "Site page not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, page, "Site page updated successfully"));
});

export { getAllSitePages, getPublicSitePage, updateSitePage };
