import mongoose from "mongoose";

const questionCardSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    slug: { type: String, required: true },
    prompt: { type: String, required: true },
    description: { type: String, default: "" },
    icon: { type: String, default: "💬" },
    illustration: { type: String, default: "/card-art/general.svg" },
    color: { type: String, default: "#F3A6C9" },
    textColor: { type: String, default: "#1f1f1f" },
    linkKey: { type: String, required: true, unique: true },
    viewCount: { type: Number, default: 0 },
    replyCount: { type: Number, default: 0 },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true },
);

questionCardSchema.index({ owner: 1, slug: 1 }, { unique: true });

export default mongoose.model("QuestionCard", questionCardSchema);
