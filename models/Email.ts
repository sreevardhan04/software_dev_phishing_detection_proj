import { Schema, model, models } from "mongoose";

const EmailSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: false
  }
);

const Email = models.Email || model("Email", EmailSchema);

export default Email;