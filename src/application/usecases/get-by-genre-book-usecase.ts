import {
  IBookRepository,
  IPaginatedBooksResponse,
} from "../../domain/repositories/bookRepository";

class GetByGenreBookUseCase {
  constructor(private bookRepository: IBookRepository) {}

  async execute(
    page: number,
    limit: number,
    genre: string
  ): Promise<IPaginatedBooksResponse> {
    const response = await this.bookRepository.getBooksByGenre(
      page,
      limit,
      genre
    );
    return response;
  }
}

export default GetByGenreBookUseCase;
