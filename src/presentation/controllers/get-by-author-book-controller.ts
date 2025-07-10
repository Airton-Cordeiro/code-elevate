import { Request, Response } from "express";
import GetByAuthorBookUseCase from "../../application/usecases/get-by-author-book-usecase";
import HttpStatus from "../../utils/httpStatus";

class GetByAuthorBookController {
  constructor(
    private readonly getBooksByAuthorUseCase: GetByAuthorBookUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const response = await this.getBooksByAuthorUseCase.execute(
        Number(req?.query?.page),
        Number(req?.query?.limit),
        String(req?.params?.author)
      );
      return res.status(HttpStatus.SUCCESS).json(response);
    } catch (error: any) {
      console.error("Error fetching books by author:", error);
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message || "Internal server error" });
    }
  }
}

export default GetByAuthorBookController;
