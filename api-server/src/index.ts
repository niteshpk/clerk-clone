import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { connectDB } from "./config/db";
import { requestIdMiddleware } from "./middleware/request-id";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import sessionRoutes from "./routes/session.routes";
import orgRoutes from "./routes/org.routes";
import errorHandler from "./middlewares/errorHandler";
import exampleRoutes from "./routes/example";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(requestIdMiddleware);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/orgs", orgRoutes);
app.use("/api/example", exampleRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

// Connect to database and start server
connectDB().then(() => {
  app.listen(PORT, () =>
    console.log(`🚀 Server running at http://localhost:${PORT}`)
  );
});
