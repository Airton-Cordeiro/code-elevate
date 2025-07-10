import { Router } from "express";

import BookRepository from "../../infrastructure/database/mongodb/repositories/bookRepository";
import RedisCacheRepository from "../../infrastructure/database/redis/repositories/cacheRepository";
import GetAllBooksUseCase from "../../application/usecases/get-all-books-usecase";
import GetAllBooksController from "../controllers/get-all-books-controller";
import GetBookByIdUseCase from "../../application/usecases/get-by-id-book-usecases";
import GetByIdBookController from "../controllers/get-by-id-book-controller";
import GetBookByGenreUseCase from "../../application/usecases/get-by-genre-book-usecase";
import GetByGenreBookController from "../controllers/get-by-genre-book-controller";
import GetByAuthorBookUseCase from "../../application/usecases/get-by-author-book-usecase";
import GetByAuthorBookController from "../controllers/get-by-author-book-controller";
import GetRecentlyViewedBooksUseCase from "../../application/usecases/get-recently-viewed-book-usecases";
import GetRecentlyViewedBooksController from "../controllers/get-recently-viewed-book-controller";

async function Routes(router: Router) {
  const bookRepository = new BookRepository();
  const cacheRepository = new RedisCacheRepository();
  const getAllBooksUseCase = new GetAllBooksUseCase(bookRepository);
  const getAllBooksController = new GetAllBooksController(getAllBooksUseCase);
  const getRecentlyViewedBooksUseCase = new GetRecentlyViewedBooksUseCase(
    cacheRepository
  );
  const getRecentlyViewedBooksController = new GetRecentlyViewedBooksController(
    getRecentlyViewedBooksUseCase
  );
  const getBookByIdUseCase = new GetBookByIdUseCase(
    bookRepository,
    cacheRepository
  );
  const getBookByIdController = new GetByIdBookController(getBookByIdUseCase);
  const getBooksByGenreUseCase = new GetBookByGenreUseCase(bookRepository);
  const getBooksByGenreController = new GetByGenreBookController(
    getBooksByGenreUseCase
  );
  const getBooksByAuthorUseCase = new GetByAuthorBookUseCase(bookRepository);
  const getBooksByAuthorController = new GetByAuthorBookController(
    getBooksByAuthorUseCase
  );

  router.get("/books", async (req, res) => {
    await getAllBooksController.handle(req, res);
  });

  router.get("/books/recently-viewed", async (req, res) => {
    await getRecentlyViewedBooksController.handle(req, res);
  });

  router.get("/books/:id", async (req, res) => {
    await getBookByIdController.handle(req, res);
  });

  router.get("/books/genre/:genre", async (req, res) => {
    await getBooksByGenreController.handle(req, res);
  });

  router.get("/books/author/:author", async (req, res) => {
    await getBooksByAuthorController.handle(req, res);
  });

  router.get("/health", (req, res) => {
    res.status(200).json({
      status: "OK",
    });
  });
}

export { Routes };
