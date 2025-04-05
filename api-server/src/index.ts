import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import routes from "./routes";
import { connectDB } from "./config/db";
import errorHandler from "./middlewares/errorHandler";
import { requestIdMiddleware } from "./middlewares/request-id";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));
app.use(requestIdMiddleware);

// Routes
app.use(routes);

// Error handling
app.use(errorHandler);

// Connect to database and start server
connectDB().then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () =>
    console.log(`🚀 Server running at http://localhost:${PORT}`)
  );
});
