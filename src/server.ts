import express, { NextFunction, Request, Response } from "express";
const app = express();
import pool from "../src/core/config/database";
import dotenv from 'dotenv';
import api from "./core/config/versioning/v1";
import {appErrorHandler,genericErrorHandler,notFound} from "./middlewares/error.middlewares"
dotenv.config();


const PORT = process.env.PORT || 8080;

app.get("/users", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM user_info");
    res.json(result.rows);
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.use(express.json());

app.listen(PORT, () => {
  console.log(`Application running on port ${PORT}`);
});

app.use("/api/v1", api);
app.use(appErrorHandler);
app.use(genericErrorHandler);
app.use(notFound)


app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  res.status(error?.code ?? 500).json(error);
});

export default app;