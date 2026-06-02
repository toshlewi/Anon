import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    card: { type: mongoose.Schema.Types.ObjectId, ref: "QuestionCard" },
    text: { type: String, required: true, maxlength: 600 },
    category: { type: String, default: "General" },
    cardColor: { type: String, default: "#F7D6E0" },
  },
  { timestamps: true },
);

export default mongoose.model("Message", messageSchema);
