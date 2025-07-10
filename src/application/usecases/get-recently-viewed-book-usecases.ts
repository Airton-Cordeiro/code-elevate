import { Book } from "../../domain/entities/book";
import { ICacheRepository } from "../../domain/repositories/cacheRepository";

class GetRecentlyViewedBooksUseCase {
  constructor(private cacheRepository: ICacheRepository) {}

  async execute(): Promise<Book | []> {
    const response = await this.cacheRepository.getCache();

    return response;
  }
}

export default GetRecentlyViewedBooksUseCase;
