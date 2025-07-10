import { Redis } from "ioredis";
import { Book } from "../../../../domain/entities/book";
import { ICacheRepository } from "../../../../domain/repositories/cacheRepository";
class RedisCacheRepository implements ICacheRepository {
  private client: Redis;

  constructor() {
    this.client = new Redis({
      host: "redis_container",
      port: 6379,
    });
  }

  async setCache(book: Book): Promise<void> {
    const key = "books_cache";
    const maxItems = 10;

    const currentBooks = await this.client.lrange(key, 0, -1);
    for (const item of currentBooks) {
      try {
        const parsed = JSON.parse(item);
        if (parsed.id === book.id) {
          await this.client.lrem(key, 0, item);
          break;
        }
      } catch (err) {
        console.warn("Erro ao validar item duplicado.", err);
      }
    }

    await this.client.lpush(key, JSON.stringify(book));
    await this.client.ltrim(key, 0, maxItems - 1);
    await this.client.expire(key, 600);
  }

  async getCache(): Promise<Book[]> {
    const key = "books_cache";
    const cachedBooks = await this.client.lrange(key, 0, -1);
    if (cachedBooks.length === 0) return [];
    return cachedBooks
      .map((item) => {
        try {
          return JSON.parse(item);
        } catch {
          return null;
        }
      })
      .filter((book) => book !== null);
  }
}
export default RedisCacheRepository;
