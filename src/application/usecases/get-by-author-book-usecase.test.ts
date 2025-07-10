import GetByAuthorBookUseCase from "./get-by-author-book-usecase";
import { mockBooksArray } from "../../mocks/book.mock";
import {
  IPaginatedBooksResponse,
  IBookRepository,
} from "../../domain/repositories/bookRepository";

describe("GetByAuthorBookUseCase", () => {
  let bookRepository: jest.Mocked<IBookRepository>;
  let useCase: GetByAuthorBookUseCase;

  beforeEach(() => {
    bookRepository = {
      getAllBooks: jest.fn(),
      getBookById: jest.fn(),
      getBooksByGenre: jest.fn(),
      getBooksByAuthor: jest.fn(),
    };
    useCase = new GetByAuthorBookUseCase(bookRepository);
  });

  it("deve retornar livros paginados por autor corretamente", async () => {
    const paginatedResponse: IPaginatedBooksResponse = {
      page: {
        totalItems: 2,
        totalPages: 1,
        currentPage: 1,
        limit: 10,
      },
      data: mockBooksArray,
    };
    bookRepository.getBooksByAuthor.mockResolvedValue(paginatedResponse);

    const result = await useCase.execute(1, 10, "Autor Exemplo");
    expect(bookRepository.getBooksByAuthor).toHaveBeenCalledWith(
      1,
      10,
      "Autor Exemplo"
    );
    expect(result).toEqual(paginatedResponse);
    expect(result.data).toHaveLength(2);
  });

  it("deve retornar lista vazia se não houver livros para o autor", async () => {
    const paginatedResponse: IPaginatedBooksResponse = {
      page: {
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
        limit: 10,
      },
      data: [],
    };
    bookRepository.getBooksByAuthor.mockResolvedValue(paginatedResponse);

    const result = await useCase.execute(1, 10, "Autor Inexistente");
    expect(result.data).toEqual([]);
    expect(result.page.totalItems).toBe(0);
  });
});
