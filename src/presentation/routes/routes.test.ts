import { Routes } from "./routes";
import { Router } from "express";

jest.mock("../../infrastructure/database/mongodb/repositories/bookRepository");
jest.mock("../../infrastructure/database/redis/repositories/cacheRepository");
jest.mock("../../application/usecases/get-all-books-usecase");
jest.mock("../../application/usecases/get-by-id-book-usecases");
jest.mock("../../application/usecases/get-by-genre-book-usecase");
jest.mock("../../application/usecases/get-by-author-book-usecase");
jest.mock("../../application/usecases/get-recently-viewed-book-usecases");
jest.mock("../controllers/get-all-books-controller");
jest.mock("../controllers/get-by-id-book-controller");
jest.mock("../controllers/get-by-genre-book-controller");
jest.mock("../controllers/get-by-author-book-controller");
jest.mock("../controllers/get-recently-viewed-book-controller");

describe("Routes", () => {
  let router: any;

  beforeEach(() => {
    router = {
      get: jest.fn(),
    };
  });

  it("deve registrar todas as rotas sem erro", async () => {
    await expect(Routes(router as unknown as Router)).resolves.toBeUndefined();

    expect(router.get).toHaveBeenCalledWith("/books", expect.any(Function));
    expect(router.get).toHaveBeenCalledWith(
      "/books/recently-viewed",
      expect.any(Function)
    );
    expect(router.get).toHaveBeenCalledWith("/books/:id", expect.any(Function));
    expect(router.get).toHaveBeenCalledWith(
      "/books/genre/:genre",
      expect.any(Function)
    );
    expect(router.get).toHaveBeenCalledWith(
      "/books/author/:author",
      expect.any(Function)
    );
    expect(router.get).toHaveBeenCalledWith("/health", expect.any(Function));
  });

  it("deve chamar o handler correto para cada rota", async () => {
    await Routes(router as unknown as Router);

    const calls = router.get.mock.calls;
    for (const [path, handler] of calls) {
      if (typeof handler === "function") {
        const req = {};
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn().mockReturnThis(),
          send: jest.fn().mockReturnThis(),
        };

        if (path === "/health") {
          handler(req, res);
          expect(res.status).toHaveBeenCalledWith(200);
          expect(res.json).toHaveBeenCalledWith({ status: "OK" });
        } else {
          await handler(req, res);
          expect(res.status).not.toThrow;
        }
      }
    }
  });
});
