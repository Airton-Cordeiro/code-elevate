import GetRecentlyViewedBooksUseCase from "./get-recently-viewed-book-usecases";
import { mockBooksArray } from "../../mocks/book.mock";
import { ICacheRepository } from "../../domain/repositories/cacheRepository";

describe("GetRecentlyViewedBooksUseCase", () => {
  let cacheRepository: jest.Mocked<ICacheRepository>;
  let useCase: GetRecentlyViewedBooksUseCase;

  beforeEach(() => {
    cacheRepository = {
      setCache: jest.fn(),
      getCache: jest.fn(),
    };
    useCase = new GetRecentlyViewedBooksUseCase(cacheRepository);
  });

  it("deve retornar livros recentemente visualizados", async () => {
    cacheRepository.getCache.mockResolvedValue(mockBooksArray);

    const result = await useCase.execute();

    expect(cacheRepository.getCache).toHaveBeenCalled();
    expect(result).toEqual(mockBooksArray);
    expect(result).toHaveLength(2);
  });

  it("deve retornar lista vazia se não houver livros no cache", async () => {
    cacheRepository.getCache.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(cacheRepository.getCache).toHaveBeenCalled();
    expect(result).toEqual([]);
  });
});
