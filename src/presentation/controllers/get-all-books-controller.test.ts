import GetAllBooksController from "./get-all-books-controller";
import { mockBooksArray } from "../../mocks/book.mock";
import { Request, Response } from "express";
import HttpStatus from "../../utils/httpStatus";

describe("GetAllBooksController", () => {
  let useCase: any;
  let controller: GetAllBooksController;
  let req: Partial<Request>;
  let res: Partial<Response>;

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
  });

  it("deve retornar livros paginados com status 200", async () => {
    useCase.execute.mockResolvedValue(mockBooksArray);
    await controller.handle(req as Request, res as Response);
    expect(useCase.execute).toHaveBeenCalledWith(1, 10);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.SUCCESS);
    expect(res.send).toHaveBeenCalledWith(mockBooksArray);
  });

  it("deve retornar erro 500 em caso de exceção", async () => {
    useCase.execute.mockRejectedValue(new Error("Erro interno"));
    await controller.handle(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({ error: "Erro interno" });
  });
});
