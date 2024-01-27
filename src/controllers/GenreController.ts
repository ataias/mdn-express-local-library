import type { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
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

export const genreCreateGet = (
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  res.render("genre_form", { title: "Create Genre" });
};

// Note the array of middleware functions
export const genreCreatePost = [
  body("name", "Genre name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  asyncHandler(async (req, res, _next) => {
    const errors = validationResult(req);
    const genre = new Genre({ name: req.body.name });

    if (!errors.isEmpty()) {
      res.render("genre_form", {
        title: "Create Genre",
        genre,
        errors: errors.array(),
      });
      return;
    }

    const genreExists = await Genre.findOne({ name: req.body.name })
      .collation({ locale: "en", strength: 2 })
      .exec();
    if (genreExists) {
      res.redirect(genreExists.url);
    } else {
      await genre.save();
      res.redirect(genre.url);
    }
  }),
];

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
