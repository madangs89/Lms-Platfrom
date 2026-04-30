import express from "express";
import cors from "cors";
import { connectPrisma } from "./config/prisma.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(3000,async () => {
  await connectPrisma();
  console.log("Server is running on port 3000");
});
