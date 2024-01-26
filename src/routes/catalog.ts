import { Router } from "express";
import * as AuthorController from "../controllers/AuthorController";
import * as BookController from "../controllers/BookController";
import * as BookInstanceController from "../controllers/BookInstanceController";
import * as GenreController from "../controllers/GenreController";

const router = Router();

// GET catalog home page
router.get("/", BookController.index);

/// BOOK ROUTES
router.get("/book/create", BookController.bookCreateGet);
router.post("/book/create", BookController.bookCreatePost);

router.get("/book/:id/delete", BookController.bookDeleteGet);
router.post("/book/:id/delete", BookController.bookDeletePost);

router.get("/book/:id/update", BookController.bookUpdateGet);
router.post("/book/:id/update", BookController.bookUpdatePost);

router.get("/book/:id", BookController.bookDetail);
router.get("/books", BookController.bookList);

/// AUTHOR ROUTES
router.get("/author/create", AuthorController.authorCreateGet);
router.post("/author/create", AuthorController.authorCreatePost);

router.get("/author/:id/delete", AuthorController.authorDeleteGet);
router.post("/author/:id/delete", AuthorController.authorDeletePost);

router.get("/author/:id/update", AuthorController.authorUpdateGet);
router.post("/author/:id/update", AuthorController.authorUpdatePost);

router.get("/author/:id", AuthorController.authorDetail);
router.get("/authors", AuthorController.authorList);

/// GENRE ROUTES
router.get("/genre/create", GenreController.genreCreateGet);
router.post("/genre/create", GenreController.genreCreatePost);

router.get("/genre/:id/delete", GenreController.genreDeleteGet);
router.post("/genre/:id/delete", GenreController.genreDeletePost);

router.get("/genre/:id/update", GenreController.genreUpdateGet);
router.post("/genre/:id/update", GenreController.genreUpdatePost);

router.get("/genre/:id", GenreController.genreDetail);
router.get("/genres", GenreController.genreList);

/// BOOK INSTANCE ROUTES
router.get(
  "/book_instance/create",
  BookInstanceController.bookInstanceCreateGet,
);
router.post(
  "/book_instance/create",
  BookInstanceController.bookInstanceCreatePost,
);

router.get(
  "/book_instance/:id/delete",
  BookInstanceController.bookInstanceDeleteGet,
);
router.post(
  "/book_instance/:id/delete",
  BookInstanceController.bookInstanceDeletePost,
);

router.get(
  "/book_instance/:id/update",
  BookInstanceController.bookInstanceUpdateGet,
);
router.post(
  "/book_instance/:id/update",
  BookInstanceController.bookInstanceUpdatePost,
);

router.get("/book_instance/:id", BookInstanceController.bookInstanceDetail);

router.get("/book_instances", BookInstanceController.bookInstanceList);

export default router;
