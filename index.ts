import express, { Express, Request, Response } from "express";
import { user } from "./controller/routes/user.routes.js";
import { crearToken,validarToken } from "./controller/helpers/jwt.controller.js";
import morgan from 'morgan'
import cors from 'cors';
import dotenv from "dotenv";

// Environment variables
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(morgan("dev"));
app.use(cors({origin:"*"}))

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server ⚡️");
});

app.get('/tk',crearToken);
app.use("/user", validarToken,user);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
