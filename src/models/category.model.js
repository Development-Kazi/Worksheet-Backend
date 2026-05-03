import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
    order: { type: Number, default: 0 },
    image: { type: String },
    icon: { type: String },
    status: { type: String, default: "active" },
    metaTitle: { type: String },
    metaDescription: { type: String },
    metaKeywords: { type: String },
  },
  { timestamps: true },
);

export const Category = mongoose.model("Category", categorySchema);
