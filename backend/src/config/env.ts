import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT) || 5000,

  nodeEnv: process.env.NODE_ENV || "development",

  mongoUri:
    process.env.MONGO_URI ||
    "mongodb://127.0.0.1:27017/jobPortalDB",

  jwtSecret:
    process.env.JWT_SECRET || "development_secret",

  clientUrl:
    process.env.CLIENT_URL || "http://localhost:5173",
};