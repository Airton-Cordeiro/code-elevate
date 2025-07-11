import GetByIdBookController from "./get-by-id-book-controller";
import { mockBook } from "../../mocks/book.mock";
import { Request, Response } from "express";
import HttpStatus from "../../utils/httpStatus";

describe("GetByIdBookController", () => {
  let useCase: any;
  let controller: GetByIdBookController;
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    useCase = { execute: jest.fn() };
    controller = new GetByIdBookController(useCase as any);
    req = {
      params: { id: "1" },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  it("deve retornar um livro por id com status 200", async () => {
    useCase.execute.mockResolvedValue(mockBook);
    await controller.handle(req as Request, res as Response);
    expect(useCase.execute).toHaveBeenCalledWith("1");
    expect(res.status).toHaveBeenCalledWith(HttpStatus.SUCCESS);
    expect(res.json).toHaveBeenCalledWith(mockBook);
  });

  it("deve retornar erro 500 em caso de exceção", async () => {
    useCase.execute.mockRejectedValue(new Error("Erro interno"));
    await controller.handle(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({ error: "Erro interno" });
  });

  it("deve retornar erro 404 quando livro não encontrado", async () => {
    const notFoundError = new Error("Book ID 1 not found.");
    (notFoundError as any).statusCode = HttpStatus.NOT_FOUND;

    useCase.execute.mockRejectedValue(notFoundError);
    await controller.handle(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({ error: "Book ID 1 not found." });
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
