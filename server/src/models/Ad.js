import mongoose from "mongoose";

const adSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    mediaType: { type: String, enum: ["image", "video", "poster", "text"], default: "image" },
    imageUrl: { type: String, default: "" },
    videoUrl: { type: String, default: "" },
    posterUrl: { type: String, default: "" },
    description: { type: String, default: "" },
    businessContact: { type: String, default: "" },
    link: { type: String, required: true },
    slot: { type: String, enum: ["hero", "sidebar", "footer", "send"], default: "send" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.model("Ad", adSchema);
