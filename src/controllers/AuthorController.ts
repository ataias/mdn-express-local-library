import asyncHandler from "express-async-handler";
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
  res.send("NOT IMPLEMENTED: Author Create GET");
});

export const authorCreatePost = asyncHandler(async (_req, res, _next) => {
  res.send("NOT IMPLEMENTED: Author Create POST");
});

export const authorDeleteGet = asyncHandler(async (_req, res, _next) => {
  res.send("NOT IMPLEMENTED: Author Delete GET");
});

export const authorDeletePost = asyncHandler(async (_req, res, _next) => {
  res.send("NOT IMPLEMENTED: Author Delete POST");
});

export const authorUpdateGet = asyncHandler(async (_req, res, _next) => {
  res.send("NOT IMPLEMENTED: Author Update GET");
});

export const authorUpdatePost = asyncHandler(async (_req, res, _next) => {
  res.send("NOT IMPLEMENTED: Author Update POST");
});
