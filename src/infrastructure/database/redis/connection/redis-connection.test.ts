import { redisClient } from "./redis-connection";
import Redis from "ioredis";

jest.mock("ioredis");

describe("RedisClient", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (Redis as unknown as jest.Mock).mockClear();
  });

  it("deve conectar ao Redis sem lançar erro", () => {
    expect(() => redisClient.connect()).not.toThrow();
    expect(Redis).toHaveBeenCalled();
  });

  it("deve retornar o client após conectar", () => {
    redisClient.connect();
    const client = redisClient.getClient();
    expect(client).toBeDefined();
  });

  it("deve lançar erro se getClient for chamado antes de conectar", () => {
    (redisClient as any).client = undefined;
    expect(() => redisClient.getClient()).toThrow(
      "Redis client is not connected. Please call connect() first."
    );
  });

  it("deve desconectar sem lançar erro", async () => {
    redisClient.connect();
    const client = redisClient.getClient();
    client.quit = jest.fn().mockResolvedValue(undefined);
    await expect(redisClient.disconnect()).resolves.not.toThrow();
    expect((redisClient as any).client).toBeUndefined();
  });
});
