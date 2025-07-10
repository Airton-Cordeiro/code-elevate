import { mockBook, mockBooksArray } from "../../mocks/book.mock";
import { ICacheRepository } from "./cacheRepository";

describe("ICacheRepository", () => {
  let repo: jest.Mocked<ICacheRepository>;

  beforeEach(() => {
    repo = {
      setCache: jest.fn(),
      getCache: jest.fn(),
    };
  });

  it("deve salvar um livro no cache", async () => {
    await repo.setCache(mockBook);
    expect(repo.setCache).toHaveBeenCalledWith(mockBook);
  });

  it("deve salvar um array de livros no cache", async () => {
    await repo.setCache([]);
    expect(repo.setCache).toHaveBeenCalledWith([]);
  });

  it("deve retornar livros do cache", async () => {
    repo.getCache.mockResolvedValue(mockBooksArray);
    const result = await repo.getCache();
    expect(result).toEqual(mockBooksArray);
    expect(result.length).toBe(2);
  });

  it("deve retornar lista vazia se não houver livros no cache", async () => {
    repo.getCache.mockResolvedValue([]);
    const result = await repo.getCache();
    expect(result).toEqual([]);
  });
});
