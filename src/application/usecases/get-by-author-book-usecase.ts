import { Book } from "../../domain/entities/book";
import {
  IBookRepository,
  IPaginatedBooksResponse,
} from "../../domain/repositories/bookRepository";

class GetByAuthorBookUseCase {
  constructor(private bookRepository: IBookRepository) {}

  async execute(
    page: number,
    limit: number,
    author: string
  ): Promise<IPaginatedBooksResponse> {
    const response = await this.bookRepository.getBooksByAuthor(
      page,
      limit,
      author
    );
    return response;
  }
}

export default GetByAuthorBookUseCase;
