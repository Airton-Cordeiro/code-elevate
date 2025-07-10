import { Book } from "../../domain/entities/book";
import { IBookRepository } from "../../domain/repositories/bookRepository";
import { ICacheRepository } from "../../domain/repositories/cacheRepository";

class GetBookByIdUseCase {
  constructor(
    private bookRepository: IBookRepository,
    private cacheRepository: ICacheRepository
  ) {}

  async execute(id: string): Promise<Book | []> {
    const response = await this.bookRepository.getBookById(id);
    if (response) {
      await this.cacheRepository.setCache(response);
    }
    return response;
  }
}

export default GetBookByIdUseCase;
