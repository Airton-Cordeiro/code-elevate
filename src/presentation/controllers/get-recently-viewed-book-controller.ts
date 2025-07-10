import { Request, Response } from "express";
import GetRecentlyViewedBooksUseCase from "../../application/usecases/get-recently-viewed-book-usecases";
import HttpStatus from "../../utils/httpStatus";
class GetRecentlyViewedBooksController {
  constructor(
    private readonly getRecentlyViewedBooksUseCase: GetRecentlyViewedBooksUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const response = await this.getRecentlyViewedBooksUseCase.execute();
      return res.status(HttpStatus.SUCCESS).send(response);
    } catch (error: any) {
      console.error("Error fetching recently viewed books:", error);
      return res
        .status(error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message || "Internal server error" });
    }
  }
}

export default GetRecentlyViewedBooksController;
