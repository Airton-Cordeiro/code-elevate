import express from "express";
import { Routes } from "./presentation/routes/routes";
import { mongoDB } from "./infrastructure/database/mongodb/connection/mongodb-connection";

const main = async () => {
  await mongoDB.connect();
  const app = express();
  app.use(express.json());
  const router = express.Router();
  await Routes(router);
  app.use(router);

  app.listen(8000, () => {
    console.log("Server is running on port 8000");
  });
};

main();
