import GetAllBooksController from "./get-all-books-controller";
import { mockBooksArray } from "../../mocks/book.mock";
import { Request, Response } from "express";
import HttpStatus from "../../utils/httpStatus";

describe("GetAllBooksController", () => {
  let useCase: any;
  let controller: GetAllBooksController;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    useCase = { execute: jest.fn() };
    controller = new GetAllBooksController(useCase as any);
    req = {
      query: { page: "1", limit: "10" },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("deve retornar livros paginados com status 200", async () => {
    useCase.execute.mockResolvedValue(mockBooksArray);
    await controller.handle(req as Request, res as Response);
    expect(useCase.execute).toHaveBeenCalledWith(1, 10);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.SUCCESS);
    expect(res.send).toHaveBeenCalledWith(mockBooksArray);
  });

  it("deve retornar erro 500 em caso de exceção", async () => {
    const error = new Error("Erro interno");
    useCase.execute.mockRejectedValue(error);
    await controller.handle(req as Request, res as Response);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error fetching all books:",
      error
    );
    expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({ error: "Erro interno" });
  });

  it("deve retornar erro 400 para parâmetros de paginação inválidos", async () => {
    const badRequestError = new Error("Invalid page or limit parameters.");
    (badRequestError as any).statusCode = HttpStatus.BAD_REQUEST;

    useCase.execute.mockRejectedValue(badRequestError);
    await controller.handle(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid page or limit parameters.",
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
});
