import GetRecentlyViewedBooksController from "./get-recently-viewed-book-controller";
import { mockBooksArray } from "../../mocks/book.mock";
import { Request, Response } from "express";
import HttpStatus from "../../utils/httpStatus";

describe("GetRecentlyViewedBooksController", () => {
  let useCase: any;
  let controller: GetRecentlyViewedBooksController;
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    useCase = { execute: jest.fn() };
    controller = new GetRecentlyViewedBooksController(useCase as any);
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  it("deve retornar livros recentemente visualizados com status 200", async () => {
    useCase.execute.mockResolvedValue(mockBooksArray);
    await controller.handle(req as Request, res as Response);
    expect(useCase.execute).toHaveBeenCalled();
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
