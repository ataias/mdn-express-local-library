import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import { HttpError } from "../errors/HttpError";
import { Book } from "../models/Book";
import { BookInstance } from "../models/BookInstance";

export const bookInstanceList = asyncHandler(async (_req, res, _next) => {
  const allBookInstances = await BookInstance.find({}).populate("book").exec();

  res.render("book_instance_list", {
    title: "Book Instance List",
    book_instance_list: allBookInstances,
  });
});

export const bookInstanceDetail = asyncHandler(async (req, res, next) => {
  const bookInstance = await BookInstance.findById(req.params.id)
    .populate("book")
    .exec();
  if (bookInstance === null) {
    const err = new HttpError("Book copy not found", 404);
    return next(err);
  }

  res.render("book_instance_detail", {
    title: "Book:",
    book_instance: bookInstance,
  });
});

export const bookInstanceCreateGet = asyncHandler(async (_req, res, _next) => {
  const allBooks = await Book.find({}, "title").sort({ title: 1 }).exec();

  res.render("book_instance_form", {
    title: "Create BookInstance",
    book_list: allBooks,
    statuses: ["Maintenance", "Available", "Loaned", "Reserved"],
  });
});

export const bookInstanceCreatePost = [
  body("book", "Book must be specified").trim().isLength({ min: 1 }).escape(),
  body("imprint", "Imprint must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("status").escape(),
  body("due_back", "Invalid date")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),
  asyncHandler(async (req, res, _next) => {
    const errors = validationResult(req);

    const bookInstance = new BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back,
    });

    if (!errors.isEmpty()) {
      const allBooks = await Book.find({}, "title").sort({ title: 1 }).exec();

      res.render("book_instance_form", {
        title: "Create BookInstance",
        book_list: allBooks,
        selected_book: bookInstance.book._id,
        errors: errors.array(),
        book_instance: bookInstance,
        statuses: ["Maintenance", "Available", "Loaned", "Reserved"],
      });
      return;
    }

    await bookInstance.save();
    res.redirect(bookInstance.url);
  }),
];

export const bookInstanceDeleteGet = asyncHandler(async (_req, res, _next) => {
  res.send("NOT IMPLEMENTED: BookInstance Delete GET");
});

export const bookInstanceDeletePost = asyncHandler(async (_req, res, _next) => {
  res.send("NOT IMPLEMENTED: BookInstance Delete POST");
});

export const bookInstanceUpdateGet = asyncHandler(async (_req, res, _next) => {
  res.send("NOT IMPLEMENTED: BookInstance Update GET");
});

export const bookInstanceUpdatePost = asyncHandler(async (_req, res, _next) => {
  res.send("NOT IMPLEMENTED: BookInstance Update POST");
});
