import { mongoDB } from "./mongodb-connection";

jest.mock("mongodb", () => {
  const mDb = {
    db: jest.fn().mockReturnValue({}),
    close: jest.fn(),
  };
  return {
    MongoClient: jest.fn(() => mDb),
  };
});

describe("MongoClient", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve conectar ao banco de dados sem lançar erro", async () => {
    await expect(mongoDB.connect()).resolves.not.toThrow();
  });

  it("deve retornar o client após conectar", async () => {
    await mongoDB.connect();
    const client = mongoDB.getClient();
    expect(client).toBeDefined();
  });

  it("deve retornar o db após conectar", async () => {
    await mongoDB.connect();
    const db = mongoDB.getDb();
    expect(db).toBeDefined();
  });

  it("deve lançar erro se getClient for chamado antes de conectar", () => {
    (mongoDB as any).client = undefined;
    expect(() => mongoDB.getClient()).toThrow(
      "MongoDB client is not connected. Please call connect() first."
    );
  });

  it("deve lançar erro se getDb for chamado antes de conectar", () => {
    (mongoDB as any).db = undefined;
    expect(() => mongoDB.getDb()).toThrow(
      "MongoDB database is not connected. Please call connect() first."
    );
  });

  it("deve desconectar sem lançar erro", async () => {
    await mongoDB.connect();
    await expect(mongoDB.disconnect()).resolves.not.toThrow();
  });
});
