import RedisCacheRepository from "./cacheRepository";
import { mockBook, mockBooksArray } from "../../../../mocks/book.mock";

const redisInstance = {
  lrange: jest.fn(),
  lpush: jest.fn(),
  ltrim: jest.fn(),
  expire: jest.fn(),
  lrem: jest.fn(),
};
jest.mock("ioredis", () => ({
  Redis: jest.fn().mockImplementation(() => redisInstance),
}));

describe("RedisCacheRepository", () => {
  let repo: RedisCacheRepository;
  let redisMock: any;

  beforeEach(() => {
    repo = new RedisCacheRepository();
    redisMock = (repo as any).client;
    jest.clearAllMocks();
  });

  it("deve salvar um livro no cache sem duplicados", async () => {
    redisMock.lrange.mockResolvedValue([]);
    redisMock.lpush.mockResolvedValue(1);
    redisMock.ltrim.mockResolvedValue(1);
    redisMock.expire.mockResolvedValue(1);

    await expect(repo.setCache(mockBook)).resolves.toBeUndefined();
    expect(redisMock.lrem).not.toHaveBeenCalled();
    expect(redisMock.lpush).toHaveBeenCalled();
  });

  it("deve retornar livros do cache", async () => {
    redisMock.lrange.mockResolvedValue(
      mockBooksArray.map((b) => JSON.stringify(b))
    );
    const result = await repo.getCache();
    expect(redisMock.lrange).toHaveBeenCalledWith("books_cache", 0, -1);
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe(mockBook.id);
  });

  it("deve retornar lista vazia se não houver livros no cache", async () => {
    redisMock.lrange.mockResolvedValue([]);
    const result = await repo.getCache();
    expect(result).toEqual([]);
  });

  it("deve filtrar itens inválidos ao retornar do cache", async () => {
    redisMock.lrange.mockResolvedValue([
      JSON.stringify(mockBook),
      "invalid-json",
    ]);
    const result = await repo.getCache();
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(mockBook.id);
  });
});
