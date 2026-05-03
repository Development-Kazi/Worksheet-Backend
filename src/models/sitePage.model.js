import mongoose, { Schema } from "mongoose";

const sitePageSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      enum: ["about-us", "contact-us", "privacy-policy"],
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      default: "",
    },
    metaTitle: {
      type: String,
      default: "",
    },
    metaDescription: {
      type: String,
      default: "",
    },
    metaKeywords: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      default: "active",
    },
  },
  { timestamps: true },
);

export const SitePage = mongoose.model("SitePage", sitePageSchema);
