import GetBookByIdUseCase from "./get-by-id-book-usecases";
import { mockBook } from "../../mocks/book.mock";
import { IBookRepository } from "../../domain/repositories/bookRepository";
import { ICacheRepository } from "../../domain/repositories/cacheRepository";

describe("GetBookByIdUseCase", () => {
  let bookRepository: jest.Mocked<IBookRepository>;
  let cacheRepository: jest.Mocked<ICacheRepository>;
  let useCase: GetBookByIdUseCase;

  beforeEach(() => {
    bookRepository = {
      getAllBooks: jest.fn(),
      getBookById: jest.fn(),
      getBooksByGenre: jest.fn(),
      getBooksByAuthor: jest.fn(),
    };
    cacheRepository = {
      setCache: jest.fn(),
      getCache: jest.fn(),
    };
    useCase = new GetBookByIdUseCase(bookRepository, cacheRepository);
  });

  it("deve retornar um livro e salvar no cache", async () => {
    bookRepository.getBookById.mockResolvedValue(mockBook);

    const result = await useCase.execute("1");

    expect(bookRepository.getBookById).toHaveBeenCalledWith("1");
    expect(cacheRepository.setCache).toHaveBeenCalledWith(mockBook);
    expect(result).toEqual(mockBook);
  });

  it("deve retornar vazio se o livro não existir", async () => {
    bookRepository.getBookById.mockResolvedValue([]);

    const result = await useCase.execute("999");

    expect(bookRepository.getBookById).toHaveBeenCalledWith("999");
    expect(cacheRepository.setCache).not.toHaveBeenCalledWith(mockBook);
    expect(result).toEqual([]);
  });
});
