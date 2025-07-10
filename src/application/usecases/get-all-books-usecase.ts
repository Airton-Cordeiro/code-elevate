import { IPaginatedBooksResponse } from "../../domain/repositories/bookRepository";
import { IBookRepository } from "../../domain/repositories/bookRepository";

class GetAllBooksUseCase {
  constructor(private bookRepository: IBookRepository) {}

  async execute(page: number, limit: number): Promise<IPaginatedBooksResponse> {
    const response = await this.bookRepository.getAllBooks(page, limit);
    return response;
  }
}

export default GetAllBooksUseCase;
