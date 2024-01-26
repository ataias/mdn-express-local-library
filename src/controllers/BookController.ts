import asyncHandler from "express-async-handler";
import { Author } from "../models/Author";
import { Book } from "../models/Book";
import { BookInstance } from "../models/BookInstance";
import { Genre } from "../models/Genre";
import { HttpError } from "../errors/HttpError";

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
  res.send("NOT IMPLEMENTED: Book create GET");
});

export const bookCreatePost = asyncHandler(async (_req, res, _next) => {
  res.send("NOT IMPLEMENTED: Book create POST");
});

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
