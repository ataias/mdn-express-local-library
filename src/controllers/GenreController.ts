import asyncHandler from "express-async-handler";
import { HttpError } from "../errors/HttpError";
import { Book } from "../models/Book";
import { Genre } from "../models/Genre";

export const genreList = asyncHandler(async (_req, res, _next) => {
  const allGenres = await Genre.find().sort({ name: 1 }).exec();
  res.render("genre_list", {
    title: "Genre List",
    genre_list: allGenres,
  });
});

export const genreDetail = asyncHandler(async (req, res, next) => {
  const [genre, booksInGenre] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Book.find({ genre: req.params.id }, "title summary").exec(),
  ]);
  if (genre === null) {
    // No results
    const err = new HttpError("Genre not found", 404);
    return next(err);
  }

  res.render("genre_detail", {
    title: "Genre Detail",
    genre,
    genre_books: booksInGenre,
  });
});

export const genreCreateGet = asyncHandler(async (_req, res, _next) => {
  res.send("NOT IMPLEMENTED: Genre Create GET");
});

export const genreCreatePost = asyncHandler(async (_req, res, _next) => {
  res.send("NOT IMPLEMENTED: Genre Create POST");
});

export const genreDeleteGet = asyncHandler(async (_req, res, _next) => {
  res.send("NOT IMPLEMENTED: Genre Delete GET");
});

export const genreDeletePost = asyncHandler(async (_req, res, _next) => {
  res.send("NOT IMPLEMENTED: Genre Delete POST");
});

export const genreUpdateGet = asyncHandler(async (_req, res, _next) => {
  res.send("NOT IMPLEMENTED: Genre Update GET");
});

export const genreUpdatePost = asyncHandler(async (_req, res, _next) => {
  res.send("NOT IMPLEMENTED: Genre Update POST");
});
