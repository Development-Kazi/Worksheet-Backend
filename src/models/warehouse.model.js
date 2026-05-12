import mongoose, { Schema } from "mongoose";

const worksheetSchema = new Schema(
  {
    title: String,
    subTitle: String,
    slug: { type: String },
    price: Number,
    discountedPrice: Number,
    rating: Number,
    description: String,
    includes: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    fileUrl: String,
    thumbnail: String,
    icon: String,
    author: String,
    authorImage: String,
    publishedDate: Date,
    tags: [String],
    metaTitle: String,
    metaDescription: String,
    metaKeywords: String,
    status: { type: String, default: "active" },
  },
  { timestamps: true },
);

export const Worksheet = mongoose.model("Worksheet", worksheetSchema);
