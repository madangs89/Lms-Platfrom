import express from "express";
import cors from "cors";
import { connectPrisma } from "./config/prisma.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});


app.use("/api/v1/auth" , authRouter)

app.listen(3000, async () => {
  await connectPrisma();
  console.log("Server is running on port 3000");
});
