import type { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import { HttpError } from "../errors/HttpError";
import { Author } from "../models/Author";
import { Book } from "../models/Book";
import { BookInstance } from "../models/BookInstance";
import { Genre } from "../models/Genre";

export const index = asyncHandler(async (_req, res, _next) => {
  const [
    numBooks,
    numBookInstances,
    numAvailableBookInstances,
    numAuthors,
    numGenres,
  ] = await Promise.all([
    Book.countDocuments({}).exec(),
    BookInstance.countDocuments({}).exec(),
    BookInstance.countDocuments({ status: "Available" }).exec(),
    Author.countDocuments({}).exec(),
    Genre.countDocuments({}).exec(),
  ]);

  res.render("index", {
    title: "Local Library Home",
    book_count: numBooks,
    book_instance_count: numBookInstances,
    book_instance_available_count: numAvailableBookInstances,
    author_count: numAuthors,
    genre_count: numGenres,
  });
});

export const bookList = asyncHandler(async (_req, res, _next) => {
  const allBooks = await Book.find({}, "title author")
    .sort({ title: 1 })
    .populate("author")
    .exec();
  res.render("book_list", { title: "Book List", book_list: allBooks });
});

export const bookDetail = asyncHandler(async (req, res, next) => {
  const [book, bookInstances] = await Promise.all([
    Book.findById(req.params.id).populate("author").populate("genre").exec(),
    BookInstance.find({ book: req.params.id }).exec(),
  ]);

  if (book === null) {
    // No results
    const err = new HttpError("Book not found", 404);
    return next(err);
  }

  res.render("book_detail", {
    title: book.title,
    book,
    book_instances: bookInstances,
  });
});

export const bookCreateGet = asyncHandler(async (_req, res, _next) => {
  const [allAuthors, allGenres] = await Promise.all([
    Author.find().sort({ family_name: 1 }).exec(),
    Genre.find().sort({ name: 1 }).exec(),
  ]);

  res.render("book_form", {
    title: "Create Book",
    authors: allAuthors,
    genres: allGenres,
  });
});

export const bookCreatePost = [
  // Convert the Genre to an Array
  (req: Request, res: Response, next: NextFunction) => {
    if (!Array.isArray(req.body.genre)) {
      req.body.genre =
        typeof req.body.genre === "undefined" ? [] : [req.body.genre];
    }
    next();
  },
  body("title", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("author", "Author must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("summary", "Summary must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("isbn", "ISBN must not be empty.").trim().isLength({ min: 1 }).escape(),
  body("genre.*").escape(),
  asyncHandler(async (req, res, _next) => {
    const errors = validationResult(req);

    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: req.body.genre,
    });

    if (!errors.isEmpty()) {
      const [allAuthors, allGenres] = await Promise.all([
        Author.find().sort({ family_name: 1 }).exec(),
        Genre.find().sort({ name: 1 }).exec(),
      ]);

      for (const genre of allGenres) {
        if (book.genre.includes(genre._id)) {
          Object.assign(genre, { checked: true });
        }
      }
      res.render("book_form", {
        title: "Create Book",
        authors: allAuthors,
        genres: allGenres,
        book,
        errors: errors.array(),
      });
      return;
    }

    await book.save();
    res.redirect(book.url);
  }),
];

export const bookDeleteGet = asyncHandler(async (_req, res, _next) => {
  res.send("NOT IMPLEMENTED: Book delete GET");
});

export const bookDeletePost = asyncHandler(async (_req, res, _next) => {
  res.send("NOT IMPLEMENTED: Book delete POST");
});

export const bookUpdateGet = asyncHandler(async (_req, res, _next) => {
  res.send("NOT IMPLEMENTED: Book update GET");
});

export const bookUpdatePost = asyncHandler(async (_req, res, _next) => {
  res.send("NOT IMPLEMENTED: Book update POST");
});
