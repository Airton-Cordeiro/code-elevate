import { config } from "dotenv";
import Redis from "ioredis";
config();

class RedisClient {
  private client: Redis | undefined;

  public connect(): void {
    if (!this.client) {
      const url = "redis://localhost:6379";
      this.client = new Redis(url);
      console.log("Connected to Redis!");
    }
  }

  public getClient(): Redis {
    if (!this.client) {
      throw new Error(
        "Redis client is not connected. Please call connect() first."
      );
    }
    return this.client;
  }

  public async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      this.client = undefined;
    }
  }
}

export const redisClient = new RedisClient();
