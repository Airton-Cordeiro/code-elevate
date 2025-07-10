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
});
