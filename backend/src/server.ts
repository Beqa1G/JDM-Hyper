import "dotenv/config";
import env from "./utils/validatedotenv";
import express, { NextFunction, Request, Response } from "express";
import mainRoute from "./routes/main.routes";
import usersRoute from "./routes/user.routes";
import adminsRoute from "./routes/admin.routes"
import authRoute from "./routes/auth.routes"
import logger from "./utils/logger";
import morgan from "morgan";
import cors from "cors";
import createHttpError, { isHttpError } from "http-errors";
import { migration } from "./db/database";
import cookieParser from "cookie-parser";


const app = express();
const port = env.PORT;

app.use(
  cors({
    origin: 'http://localhost:3000', 
    credentials: true, 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
  })
);

app.use(morgan("dev"));

app.use(express.json());


app.use(cookieParser());

app.use("/", mainRoute);

app.use("/api/auth", authRoute)

app.use("/api/adminpage", adminsRoute)

app.use("/api/users", usersRoute);

app.use((req, res, next) => {
  next(createHttpError(404, "endpoint not found"));
});

app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  logger.error(error);
  let errorMessage = "unknown error";
  let statusCode = 500;
  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  }
  res.status(statusCode).json({ error: errorMessage });
});

app.listen(port, async () => {
  logger.info("app is running on port:" + port);
});


migration().catch(err => {
  logger.error(err);
})