import { Request, Response } from "express";
import GetBookByIdUseCase from "../../application/usecases/get-by-id-book-usecases";
import HttpStatus from "../../utils/httpStatus";

class GetByIdBookController {
  constructor(private readonly getByIdBookUseCase: GetBookByIdUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const response = await this.getByIdBookUseCase.execute(
        String(req?.params?.id)
      );
      return res.status(HttpStatus.SUCCESS).json(response);
    } catch (error: any) {
      return res
        .status(error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message || "Internal server error" });
    }
  }
}

export default GetByIdBookController;
