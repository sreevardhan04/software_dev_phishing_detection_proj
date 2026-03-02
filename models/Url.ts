import { Schema, model, models } from "mongoose";

const UrlSchema = new Schema(
  {
    url: {
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

const Url = models.Url || model("Url", UrlSchema);

export default Url;


