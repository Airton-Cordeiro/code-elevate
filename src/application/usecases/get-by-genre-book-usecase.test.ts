import GetByGenreBookUseCase from "./get-by-genre-book-usecase";
import { mockBooksArray } from "../../mocks/book.mock";
import {
  IPaginatedBooksResponse,
  IBookRepository,
} from "../../domain/repositories/bookRepository";

describe("GetByGenreBookUseCase", () => {
  let bookRepository: jest.Mocked<IBookRepository>;
  let useCase: GetByGenreBookUseCase;

  beforeEach(() => {
    bookRepository = {
      getAllBooks: jest.fn(),
      getBookById: jest.fn(),
      getBooksByGenre: jest.fn(),
      getBooksByAuthor: jest.fn(),
    };
    useCase = new GetByGenreBookUseCase(bookRepository);
  });

  it("deve retornar livros paginados por gênero corretamente", async () => {
    const paginatedResponse: IPaginatedBooksResponse = {
      page: {
        totalItems: 2,
        totalPages: 1,
        currentPage: 1,
        limit: 10,
      },
      data: mockBooksArray,
    };
    bookRepository.getBooksByGenre.mockResolvedValue(paginatedResponse);

    const result = await useCase.execute(1, 10, "Ficção");
    expect(bookRepository.getBooksByGenre).toHaveBeenCalledWith(
      1,
      10,
      "Ficção"
    );
    expect(result).toEqual(paginatedResponse);
    expect(result.data).toHaveLength(2);
  });

  it("deve retornar lista vazia se não houver livros para o gênero", async () => {
    const paginatedResponse: IPaginatedBooksResponse = {
      page: {
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
        limit: 10,
      },
      data: [],
    };
    bookRepository.getBooksByGenre.mockResolvedValue(paginatedResponse);

    const result = await useCase.execute(1, 10, "Gênero Inexistente");
    expect(result.data).toEqual([]);
    expect(result.page.totalItems).toBe(0);
  });
});
