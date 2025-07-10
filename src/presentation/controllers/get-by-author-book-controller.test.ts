import GetByAuthorBookController from "./get-by-author-book-controller";
import { mockBooksArray } from "../../mocks/book.mock";
import { Request, Response } from "express";
import HttpStatus from "../../utils/httpStatus";

describe("GetByAuthorBookController", () => {
  let useCase: any;
  let controller: GetByAuthorBookController;
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    useCase = { execute: jest.fn() };
    controller = new GetByAuthorBookController(useCase as any);
    req = {
      query: { page: "1", limit: "10" },
      params: { author: "Autor Exemplo" },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  it("deve retornar livros por autor com status 200", async () => {
    useCase.execute.mockResolvedValue(mockBooksArray);
    await controller.handle(req as Request, res as Response);
    expect(useCase.execute).toHaveBeenCalledWith(1, 10, "Autor Exemplo");
    expect(res.status).toHaveBeenCalledWith(HttpStatus.SUCCESS);
    expect(res.json).toHaveBeenCalledWith(mockBooksArray);
  });

  it("deve retornar erro 500 em caso de exceção", async () => {
    useCase.execute.mockRejectedValue(new Error("Erro interno"));
    await controller.handle(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({ error: "Erro interno" });
  });
});
