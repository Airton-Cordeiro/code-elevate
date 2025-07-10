import { Request, Response } from "express";
import GetAllBooksUseCase from "../../application/usecases/get-all-books-usecase";
import HttpStatus from "../../utils/httpStatus";

class GetAllBooksController {
  constructor(private readonly getAllBooksUseCase: GetAllBooksUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const response = await this.getAllBooksUseCase.execute(
        Number(req?.query?.page),
        Number(req?.query?.limit)
      );
      return res.status(HttpStatus.SUCCESS).send(response);
    } catch (error: any) {
      console.error("Error fetching all books:", error);
      return res
        .status(error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message || "Internal server error" });
    }
  }
}

export default GetAllBooksController;
