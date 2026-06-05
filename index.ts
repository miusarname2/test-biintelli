import express, { Express, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { journeyRoute } from "./app/Journey/aplication/journey.routes.js";
import { crearToken,validarToken } from "./auth/jwt.js";
import morgan from 'morgan'
import cors from 'cors';
import dotenv from "dotenv";

// Environment variables
dotenv.config({path:"./"});

//Init server
const app: Express = express();
const port = process.env.PORT || 3000;

// Adding Middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(cors({origin:"*"}))

// Config Swagger

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
        url: `http://localhost:${port}`,
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
  apis: ["index.ts","./auth/jwt.ts","./app/Journey/aplication/journey.routes.ts"],
};

// Init swagger
const specs = swaggerJsdoc(options);

// API JSON endpoint
app.get("/api-json", (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(specs);
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs, {
  customCss: '.swagger-ui { background: #f5f5f5; }',
  customSiteTitle: 'Flight Manager API Docs'
}));

// Define routes
app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server ⚡️");
});

app.post('/tk',crearToken);
app.use("/journey",validarToken,journeyRoute);

//Listen port
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
