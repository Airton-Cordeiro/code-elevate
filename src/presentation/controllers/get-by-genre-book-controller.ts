import { Request, Response } from "express";
import GetBookByGenreUseCase from "../../application/usecases/get-by-genre-book-usecase";
import HttpStatus from "../../utils/httpStatus";
class GetByGenreBookController {
  constructor(private readonly getBooksByGenreUseCase: GetBookByGenreUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const response = await this.getBooksByGenreUseCase.execute(
        Number(req?.query?.page),
        Number(req?.query?.limit),
        String(req?.params?.genre)
      );
      return res.status(HttpStatus.SUCCESS).json(response);
    } catch (error: any) {
      console.error("Error fetching books by genre:", error);
      return res
        .status(error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message || "Internal server error" });
    }
  }
}

export default GetByGenreBookController;
