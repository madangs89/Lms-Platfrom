import express from "express";
import cors from "cors";
import { connectPrisma } from "./config/prisma.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import departmentRouter from "./routes/department.routes.js";
import userRouter from "./routes/user.routes.js";

const app = express();

app.use(
  cors({
    origin: `${process.env.CLIENT_URL}`,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS" , "PATCH"],
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);

app.use("/api/v1/department", departmentRouter);

app.listen(3000, async () => {
  await connectPrisma();
  console.log("Server is running on port 3000");
});
