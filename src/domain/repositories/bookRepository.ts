import { Book } from "../entities/book";

interface IPaginatedBooksResponse {
  page: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
  data: Book[];
}

export interface IBookRepository {
  getAllBooks(page: number, limit: number): Promise<IPaginatedBooksResponse>;
  getBookById(id: string): Promise<Book | []>;
  getBooksByGenre(
    page: number,
    limit: number,
    genre: string
  ): Promise<IPaginatedBooksResponse>;
  getBooksByAuthor(
    page: number,
    limit: number,
    author: string
  ): Promise<IPaginatedBooksResponse>;
}

export default IBookRepository;
export { IPaginatedBooksResponse };
