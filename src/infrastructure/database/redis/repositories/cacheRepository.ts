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
    const listKey = "books_cache_ids";
    const bookKey = `book_cache:${book.id}`;
    const maxItems = 10;

    await this.client.set(bookKey, JSON.stringify(book), "EX", 60);
    await this.client.lrem(listKey, 0, book.id);
    await this.client.lpush(listKey, book.id);
    await this.client.ltrim(listKey, 0, maxItems - 1);

    const ids = await this.client.lrange(listKey, maxItems, -1);
    for (const oldId of ids) {
      await this.client.del(`book_cache:${oldId}`);
    }
  }

  async getCache(): Promise<Book[]> {
    const listKey = "books_cache_ids";
    const ids = await this.client.lrange(listKey, 0, -1);
    const books: Book[] = [];
    for (const id of ids) {
      const cached = await this.client.get(`book_cache:${id}`);
      if (cached) {
        try {
          books.push(JSON.parse(cached));
        } catch {}
      }
    }
    return books;
  }
}
export default RedisCacheRepository;
