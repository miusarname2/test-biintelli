import express, { Express, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { journeyRoute } from "../app/Journey/aplication/journey.routes.js";
import { crearToken, validarToken } from "../auth/jwt.js";
import morgan from 'morgan';
import cors from 'cors';
import dotenv from "dotenv";

// Environment variables
dotenv.config({ path: ".env.local" });

// Init server
const app: Express = express();

// Adding Middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(cors({ origin: "*" }));

// Swagger config
const options = {
  swaggerDefinition: {
    openapi: "3.1.0",
    info: {
      title: "Flight Manager",
      version: "1.0.0",
      description: "API de gestión de viajes y vuelos",
    },
    servers: [
      {
        url: `https://${process.env.VERCEL_URL || 'localhost:3000'}`,
      },
      {
        url: `http://localhost:3000`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      }
    },
  },
  apis: ["api/index.ts", "auth/jwt.ts", "app/Journey/aplication/journey.routes.ts"],
};

const specs = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Define routes
app.get("/", (req: Request, res: Response) => {
  res.send("🚀 Flight Manager API - Running on Vercel");
});

app.post('/tk', crearToken);
app.use("/journey", validarToken, journeyRoute);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

export default app;
