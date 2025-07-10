import RedisCacheRepository from "./cacheRepository";
import { mockBook, mockBooksArray } from "../../../../mocks/book.mock";

const redisInstance = {
  set: jest.fn(),
  lrem: jest.fn(),
  lpush: jest.fn(),
  ltrim: jest.fn(),
  lrange: jest.fn(),
  del: jest.fn(),
  get: jest.fn(),
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

  it("deve salvar um livro no cache, atualizar lista e remover ids antigos", async () => {
    redisMock.set.mockResolvedValue("OK");
    redisMock.lrem.mockResolvedValue(0);
    redisMock.lpush.mockResolvedValue(1);
    redisMock.ltrim.mockResolvedValue(1);
    redisMock.lrange.mockResolvedValueOnce([]);

    await expect(repo.setCache(mockBook)).resolves.toBeUndefined();

    expect(redisMock.set).toHaveBeenCalledWith(
      `book_cache:${mockBook.id}`,
      JSON.stringify(mockBook),
      "EX",
      60
    );
    expect(redisMock.lrem).toHaveBeenCalledWith(
      "books_cache_ids",
      0,
      mockBook.id
    );
    expect(redisMock.lpush).toHaveBeenCalledWith(
      "books_cache_ids",
      mockBook.id
    );
    expect(redisMock.ltrim).toHaveBeenCalledWith("books_cache_ids", 0, 9);
    expect(redisMock.lrange).toHaveBeenCalledWith("books_cache_ids", 10, -1);
    expect(redisMock.del).not.toHaveBeenCalled();
  });

  it("deve remover livros antigos do cache ao exceder o limite", async () => {
    redisMock.set.mockResolvedValue("OK");
    redisMock.lrem.mockResolvedValue(0);
    redisMock.lpush.mockResolvedValue(1);
    redisMock.ltrim.mockResolvedValue(1);
    redisMock.lrange.mockResolvedValueOnce(["old1", "old2"]);
    redisMock.del.mockResolvedValue(1);

    await repo.setCache(mockBook);

    expect(redisMock.del).toHaveBeenCalledWith("book_cache:old1");
    expect(redisMock.del).toHaveBeenCalledWith("book_cache:old2");
  });

  it("deve retornar livros do cache", async () => {
    redisMock.lrange.mockResolvedValue([mockBook.id, mockBooksArray[1].id]);
    redisMock.get.mockImplementation((key: string) => {
      if (key === `book_cache:${mockBook.id}`)
        return Promise.resolve(JSON.stringify(mockBook));
      if (key === `book_cache:${mockBooksArray[1].id}`)
        return Promise.resolve(JSON.stringify(mockBooksArray[1]));
      return Promise.resolve(null);
    });

    const result = await repo.getCache();
    expect(redisMock.lrange).toHaveBeenCalledWith("books_cache_ids", 0, -1);
    expect(redisMock.get).toHaveBeenCalledWith(`book_cache:${mockBook.id}`);
    expect(redisMock.get).toHaveBeenCalledWith(
      `book_cache:${mockBooksArray[1].id}`
    );
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe(mockBook.id);
    expect(result[1].id).toBe(mockBooksArray[1].id);
  });

  it("deve retornar lista vazia se não houver ids no cache", async () => {
    redisMock.lrange.mockResolvedValue([]);
    const result = await repo.getCache();
    expect(result).toEqual([]);
  });

  it("deve filtrar itens inválidos ao retornar do cache", async () => {
    redisMock.lrange.mockResolvedValue([mockBook.id, "invalid"]);
    redisMock.get.mockImplementation((key: string) => {
      if (key === `book_cache:${mockBook.id}`)
        return Promise.resolve(JSON.stringify(mockBook));
      if (key === `book_cache:invalid`) return Promise.resolve("invalid-json");
      return Promise.resolve(null);
    });

    const result = await repo.getCache();
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(mockBook.id);
  });

  it("deve ignorar livros não encontrados no cache", async () => {
    redisMock.lrange.mockResolvedValue([mockBook.id, "missing"]);
    redisMock.get.mockImplementation((key: string) => {
      if (key === `book_cache:${mockBook.id}`)
        return Promise.resolve(JSON.stringify(mockBook));
      if (key === `book_cache:missing`) return Promise.resolve(null);
      return Promise.resolve(null);
    });

    const result = await repo.getCache();
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(mockBook.id);
  });
});
