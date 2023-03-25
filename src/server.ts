import express from "express";
import { randomUUID } from "node:crypto";
import { Database } from "./database";
import { router } from "../router";


const server = express();

const port = 3000;

server.use(express.json());

server.use(router);

server.listen(port, () => {
  console.log(`Server Running - end: http://localhost:${port}`);
});