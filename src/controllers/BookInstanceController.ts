import asyncHandler from "express-async-handler";
import { HttpError } from "../errors/HttpError";
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
  res.send("NOT IMPLEMENTED: BookInstance Create GET");
});

export const bookInstanceCreatePost = asyncHandler(async (_req, res, _next) => {
  res.send("NOT IMPLEMENTED: BookInstance Create POST");
});

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
