import GetAllBooksUseCase from "./get-all-books-usecase";
import { mockBooksArray } from "../../mocks/book.mock";
import {
  IPaginatedBooksResponse,
  IBookRepository,
} from "../../domain/repositories/bookRepository";

describe("GetAllBooksUseCase", () => {
  let bookRepository: jest.Mocked<IBookRepository>;
  let useCase: GetAllBooksUseCase;

  beforeEach(() => {
    bookRepository = {
      getAllBooks: jest.fn(),
      getBookById: jest.fn(),
      getBooksByGenre: jest.fn(),
      getBooksByAuthor: jest.fn(),
    };
    useCase = new GetAllBooksUseCase(bookRepository);
  });

  it("deve retornar livros paginados corretamente", async () => {
    const paginatedResponse: IPaginatedBooksResponse = {
      page: {
        totalItems: 2,
        totalPages: 1,
        currentPage: 1,
        limit: 10,
      },
      data: mockBooksArray,
    };
    bookRepository.getAllBooks.mockResolvedValue(paginatedResponse);

    const result = await useCase.execute(1, 10);
    expect(bookRepository.getAllBooks).toHaveBeenCalledWith(1, 10);
    expect(result).toEqual(paginatedResponse);
    expect(result.data).toHaveLength(2);
  });

  it("deve retornar lista vazia se não houver livros", async () => {
    const paginatedResponse: IPaginatedBooksResponse = {
      page: {
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
        limit: 10,
      },
      data: [],
    };
    bookRepository.getAllBooks.mockResolvedValue(paginatedResponse);

    const result = await useCase.execute(1, 10);
    expect(result.data).toEqual([]);
    expect(result.page.totalItems).toBe(0);
  });
});
