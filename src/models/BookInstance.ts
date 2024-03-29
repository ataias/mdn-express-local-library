import { DateTime } from "luxon";
import { Schema, model } from "mongoose";

const BookInstanceSchema = new Schema({
  book: { type: Schema.Types.ObjectId, ref: "Book", required: true }, // reference to the associated book
  imprint: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ["Available", "Maintenance", "Loaned", "Reserved"],
    default: "Maintenance",
  },
  due_back: { type: Date, default: Date.now },
});

BookInstanceSchema.virtual("url").get(function () {
  return `/catalog/book_instance/${this._id}`;
});

BookInstanceSchema.virtual("due_back_formatted").get(function () {
  return DateTime.fromJSDate(this.due_back).toLocaleString(DateTime.DATE_MED);
});

BookInstanceSchema.virtual("isAvailable").get(function () {
  return this.status === "Available";
});
BookInstanceSchema.virtual("isInMaintenance").get(function () {
  return this.status === "Maintenance";
});
BookInstanceSchema.virtual("notAvailable").get(function () {
  return this.status !== "Available";
});

export const BookInstance = model("BookInstance", BookInstanceSchema);
