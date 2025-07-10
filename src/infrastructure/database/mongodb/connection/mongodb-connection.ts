import { config } from "dotenv";
import { MongoClient as Mongodb, Db } from "mongodb";
config();

class MongoClient {
  private client: Mongodb | undefined;
  private db: Db | undefined;

  public async connect(): Promise<void> {
    const url = process.env.MONGODB_URL;
    //@ts-ignore
    this.client = new Mongodb(url);
    this.db = this.client.db("books-db");
    console.log("connected to mongoDB!");
  }

  public getClient(): Mongodb | undefined {
    if (!this.client) {
      throw new Error(
        "MongoDB client is not connected. Please call connect() first."
      );
    }
    return this.client;
  }

  public getDb(): Db | undefined {
    if (!this.db) {
      throw new Error(
        "MongoDB database is not connected. Please call connect() first."
      );
    }
    return this.db;
  }

  async disconnect(): Promise<void> {
    await this.client?.close();
    this.client = undefined;
    this.db = undefined;
  }
}

export const mongoDB = new MongoClient();
