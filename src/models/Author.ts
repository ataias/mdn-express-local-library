import { DateTime } from "luxon";
import { Schema, model } from "mongoose";

const AuthorSchema = new Schema(
  {
    first_name: { type: String, required: true, maxLength: 100 },
    family_name: { type: String, required: true, maxLength: 100 },
    date_of_birth: { type: Date },
    date_of_death: { type: Date },
  },
  {
    virtuals: {
      url: {
        get() {
          return `/catalog/author/${this._id}`;
        },
      },
      date_of_birth_formatted: {
        get() {
          if (!this.date_of_birth) {
            return "";
          }
          return DateTime.fromJSDate(this.date_of_birth).toLocaleString(
            DateTime.DATE_MED,
          );
        },
      },
      date_of_death_formatted: {
        get() {
          if (!this.date_of_death) {
            return "";
          }
          return DateTime.fromJSDate(this.date_of_death).toLocaleString(
            DateTime.DATE_MED,
          );
        },
      },
      life_span: {
        get() {
          if (!this.date_of_birth) {
            return "";
          }
          const date_of_birth = DateTime.fromJSDate(
            this.date_of_birth,
          ).toLocaleString(DateTime.DATE_MED);
          const date_of_death = this.date_of_death
            ? DateTime.fromJSDate(this.date_of_death).toLocaleString(
                DateTime.DATE_MED,
              )
            : "";
          return `(${date_of_birth} - ${date_of_death})`;
        },
      },
    },
  },
);

AuthorSchema.virtual("name").get(function () {
  // To avoid errors in cases where an author does not have either a family name or first name
  // We want to make sure we handle the exception by returning an empty string for that case
  let fullname = "";
  if (this.first_name && this.family_name) {
    fullname = `${this.family_name}, ${this.first_name}`;
  }

  return fullname;
});

export const Author = model("Author", AuthorSchema);
