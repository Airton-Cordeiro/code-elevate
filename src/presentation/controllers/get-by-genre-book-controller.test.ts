import GetByGenreBookController from "./get-by-genre-book-controller";
import { mockBooksArray } from "../../mocks/book.mock";
import { Request, Response } from "express";
import HttpStatus from "../../utils/httpStatus";

describe("GetByGenreBookController", () => {
  let useCase: any;
  let controller: GetByGenreBookController;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    useCase = { execute: jest.fn() };
    controller = new GetByGenreBookController(useCase as any);
    req = {
      query: { page: "1", limit: "10" },
      params: { genre: "Ficção" },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("deve retornar livros por gênero com status 200", async () => {
    useCase.execute.mockResolvedValue(mockBooksArray);
    await controller.handle(req as Request, res as Response);
    expect(useCase.execute).toHaveBeenCalledWith(1, 10, "Ficção");
    expect(res.status).toHaveBeenCalledWith(HttpStatus.SUCCESS);
    expect(res.json).toHaveBeenCalledWith(mockBooksArray);
  });

  it("deve retornar erro 500 em caso de exceção", async () => {
    const error = new Error("Erro interno");
    useCase.execute.mockRejectedValue(error);
    await controller.handle(req as Request, res as Response);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error fetching books by genre:",
      error
    );
    expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({ error: "Erro interno" });
  });

  it("deve retornar erro 404 quando gênero não é encontrado", async () => {
    const notFoundError = new Error("Genre 'Ficção' not found.");
    (notFoundError as any).statusCode = HttpStatus.NOT_FOUND;

    useCase.execute.mockRejectedValue(notFoundError);
    await controller.handle(req as Request, res as Response);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error fetching books by genre:",
      notFoundError
    );
    expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({
      error: "Genre 'Ficção' not found.",
    });
  });

  it("deve retornar erro 400 para parâmetros inválidos", async () => {
    const badRequestError = new Error("Invalid pagination parameters.");
    (badRequestError as any).statusCode = HttpStatus.BAD_REQUEST;

    useCase.execute.mockRejectedValue(badRequestError);
    await controller.handle(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid pagination parameters.",
    });
  });

  it("deve retornar erro 500 quando erro não tem statusCode definido", async () => {
    const errorWithoutStatus = new Error("Erro sem statusCode");

    useCase.execute.mockRejectedValue(errorWithoutStatus);
    await controller.handle(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({ error: "Erro sem statusCode" });
  });

  it("deve retornar erro 500 com mensagem padrão quando erro não tem message", async () => {
    const errorWithoutMessage = {};

    useCase.execute.mockRejectedValue(errorWithoutMessage);
    await controller.handle(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal server error" });
  });

  it("deve lidar com query parameters undefined", async () => {
    req.query = {};
    useCase.execute.mockResolvedValue(mockBooksArray);

    await controller.handle(req as Request, res as Response);

    expect(useCase.execute).toHaveBeenCalledWith(NaN, NaN, "Ficção");
    expect(res.status).toHaveBeenCalledWith(HttpStatus.SUCCESS);
  });

  it("deve lidar com req.query sendo undefined", async () => {
    req.query = undefined;
    useCase.execute.mockResolvedValue(mockBooksArray);

    await controller.handle(req as Request, res as Response);

    expect(useCase.execute).toHaveBeenCalledWith(NaN, NaN, "Ficção");
    expect(res.status).toHaveBeenCalledWith(HttpStatus.SUCCESS);
  });

  it("deve lidar com req.params sendo undefined", async () => {
    req.params = undefined;
    useCase.execute.mockResolvedValue(mockBooksArray);

    await controller.handle(req as Request, res as Response);

    expect(useCase.execute).toHaveBeenCalledWith(1, 10, "undefined");
    expect(res.status).toHaveBeenCalledWith(HttpStatus.SUCCESS);
  });

  it("deve lidar com req.params.genre sendo undefined", async () => {
    req.params = {};
    useCase.execute.mockResolvedValue(mockBooksArray);

    await controller.handle(req as Request, res as Response);

    expect(useCase.execute).toHaveBeenCalledWith(1, 10, "undefined");
    expect(res.status).toHaveBeenCalledWith(HttpStatus.SUCCESS);
  });

  it("deve converter valores não numéricos para NaN", async () => {
    req.query = { page: "abc", limit: "xyz" };
    useCase.execute.mockResolvedValue(mockBooksArray);

    await controller.handle(req as Request, res as Response);

    expect(useCase.execute).toHaveBeenCalledWith(NaN, NaN, "Ficção");
    expect(res.status).toHaveBeenCalledWith(HttpStatus.SUCCESS);
  });

  it("deve converter null para NaN nos parâmetros numéricos", async () => {
    req.query = { page: undefined, limit: undefined };
    useCase.execute.mockResolvedValue(mockBooksArray);

    await controller.handle(req as Request, res as Response);

    expect(useCase.execute).toHaveBeenCalledWith(NaN, NaN, "Ficção");
    expect(res.status).toHaveBeenCalledWith(HttpStatus.SUCCESS);
  });

  it("deve converter objetos para string no parâmetro genre", async () => {
    req.params = { genre: { name: "Ficção" } as any };
    useCase.execute.mockResolvedValue(mockBooksArray);

    await controller.handle(req as Request, res as Response);

    expect(useCase.execute).toHaveBeenCalledWith(1, 10, "[object Object]");
    expect(res.status).toHaveBeenCalledWith(HttpStatus.SUCCESS);
  });

  it("deve lidar com request completamente vazio", async () => {
    const emptyReq = {} as Request;
    useCase.execute.mockResolvedValue(mockBooksArray);

    await controller.handle(emptyReq, res as Response);

    expect(useCase.execute).toHaveBeenCalledWith(NaN, NaN, "undefined");
    expect(res.status).toHaveBeenCalledWith(HttpStatus.SUCCESS);
  });
});
