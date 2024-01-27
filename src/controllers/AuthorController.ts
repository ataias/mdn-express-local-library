import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import { HttpError } from "../errors/HttpError";
import { Author } from "../models/Author";
import { Book } from "../models/Book";

export const authorList = asyncHandler(async (_req, res, _next) => {
  const authorList = await Author.find().sort({ family_name: 1 }).exec();
  res.render("author_list", {
    title: "Author List",
    author_list: authorList,
  });
});

export const authorDetail = asyncHandler(async (req, res, next) => {
  const [author, allBooksByAuthor] = await Promise.all([
    Author.findById(req.params.id).exec(),
    Book.find({ author: req.params.id }, "title summary").exec(),
  ]);

  if (author === null) {
    // No results
    const err = new HttpError("Author not found", 404);
    return next(err);
  }

  res.render("author_detail", {
    title: "Author Detail",
    author,
    author_books: allBooksByAuthor,
  });
});

export const authorCreateGet = asyncHandler(async (_req, res, _next) => {
  res.render("author_form", { title: "Create Author" });
});

export const authorCreatePost = [
  body("first_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("First name must be specified.")
    .isAlphanumeric()
    .withMessage("First name has non-alphanumeric characters."),
  body("family_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Family name must be specified.")
    .isAlphanumeric()
    .withMessage("Family name has non-alphanumeric characters."),
  body("date_of_birth", "Invalid date of birth")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),
  body("date_of_death", "Invalid date of death")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),
  asyncHandler(async (req, res, _next) => {
    const errors = validationResult(req);
    const author = new Author({
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      date_of_birth: req.body.date_of_birth,
      date_of_death: req.body.date_of_death,
    });

    if (!errors.isEmpty()) {
      res.render("author_form", {
        title: "Create Author",
        author,
        errors: errors.array(),
      });
      return;
    }

    await author.save();
    res.redirect(author.url);
  }),
];

export const authorDeleteGet = asyncHandler(async (req, res, _next) => {
  const [author, allBooksByAuthor] = await Promise.all([
    Author.findById(req.params.id).exec(),
    Book.find({ author: req.params.id }, "title summary").exec(),
  ]);

  if (author === null) {
    res.redirect("/catalog/authors");
  }

  res.render("author_delete", {
    title: "Delete Author",
    author,
    author_books: allBooksByAuthor,
  });
});

export const authorDeletePost = asyncHandler(async (req, res, _next) => {
  const [author, allBooksByAuthor] = await Promise.all([
    Author.findById(req.params.id).exec(),
    Book.find({ author: req.params.id }, "title summary").exec(),
  ]);

  if (allBooksByAuthor.length > 0) {
    res.render("author_delete", {
      title: "Delete Author",
      author: author,
      author_books: allBooksByAuthor,
    });
    return;
  }

  await Author.findByIdAndDelete(req.body.author_id);
  res.redirect("/catalog/authors");
});

export const authorUpdateGet = asyncHandler(async (_req, res, _next) => {
  res.send("NOT IMPLEMENTED: Author Update GET");
});

export const authorUpdatePost = asyncHandler(async (_req, res, _next) => {
  res.send("NOT IMPLEMENTED: Author Update POST");
});
