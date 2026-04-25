import dotenv from "dotenv";

dotenv.config();

const port: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

if (!port) {
  throw new Error("PORT is not defined in environment variables");
}

export const env = {
  PORT: port,
};
