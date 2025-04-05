import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { connectDB } from "./config/db";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import sessionRoutes from "./routes/session.routes";
import orgRoutes from "./routes/org.routes";
import exampleRoutes from "./routes/example";
import orgRoleRoutes from "./routes/organizationRole";

import errorHandler from "./middlewares/errorHandler";
import { requestIdMiddleware } from "./middlewares/request-id";

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
app.use("/api/org-roles", orgRoleRoutes);
app.use("/api/example", exampleRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

// Connect to database and start server
connectDB().then(() => {
  app.listen(PORT, () =>
    console.log(`🚀 Server running at http://localhost:${PORT}`)
  );
});
