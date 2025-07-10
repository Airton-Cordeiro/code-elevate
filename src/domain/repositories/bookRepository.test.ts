import { mockBook, mockBooksArray } from "../../mocks/book.mock";
import IBookRepository, { IPaginatedBooksResponse } from "./bookRepository";

describe("IBookRepository", () => {
  let repo: jest.Mocked<IBookRepository>;

  beforeEach(() => {
    repo = {
      getAllBooks: jest.fn(),
      getBookById: jest.fn(),
      getBooksByGenre: jest.fn(),
      getBooksByAuthor: jest.fn(),
    };
  });

  it("deve retornar livros paginados em getAllBooks", async () => {
    const paginated: IPaginatedBooksResponse = {
      page: { totalItems: 2, totalPages: 1, currentPage: 1, limit: 10 },
      data: mockBooksArray,
    };
    repo.getAllBooks.mockResolvedValue(paginated);
    const result = await repo.getAllBooks(1, 10);
    expect(result).toEqual(paginated);
    expect(result.data).toHaveLength(2);
  });

  it("deve retornar um livro em getBookById", async () => {
    repo.getBookById.mockResolvedValue(mockBook);
    const result = await repo.getBookById("1");
    expect(result).toEqual(mockBook);
  });

  it("deve retornar vazio se livro não existir em getBookById", async () => {
    repo.getBookById.mockResolvedValue([]);
    const result = await repo.getBookById("999");
    expect(result).toEqual([]);
  });

  it("deve retornar livros por gênero em getBooksByGenre", async () => {
    const paginated: IPaginatedBooksResponse = {
      page: { totalItems: 2, totalPages: 1, currentPage: 1, limit: 10 },
      data: mockBooksArray,
    };
    repo.getBooksByGenre.mockResolvedValue(paginated);
    const result = await repo.getBooksByGenre(1, 10, "Ficção");
    expect(result.data).toHaveLength(2);
  });

  it("deve retornar livros por autor em getBooksByAuthor", async () => {
    const paginated: IPaginatedBooksResponse = {
      page: { totalItems: 2, totalPages: 1, currentPage: 1, limit: 10 },
      data: mockBooksArray,
    };
    repo.getBooksByAuthor.mockResolvedValue(paginated);
    const result = await repo.getBooksByAuthor(1, 10, "Autor Exemplo");
    expect(result.data).toHaveLength(2);
  });
});
