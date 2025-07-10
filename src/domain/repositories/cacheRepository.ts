import { Book } from "../../domain/entities/book";
export interface ICacheRepository {
  setCache(book: Book | []): Promise<void>;
  getCache(): Promise<any | []>;
}
