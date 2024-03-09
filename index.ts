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
      description: "El backend de la aplicación de gestión de vídeos ofrece servicios para la administración de usuarios, gestión de vídeos y autenticación. Incluye funcionalidades como CRUD de usuarios y vídeos, autenticación segura, recuperación de vídeos por usuario, acceso a vídeos públicos y privados, lista de vídeos mejor calificados, y endpoints adicionales como búsqueda por palabras clave y gestión de comentarios. En resumen, proporciona una API segura para operaciones relacionadas con usuarios, vídeos y características clave de la aplicación.",
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
  apis: ["index.ts","./auth/jwt.ts","./app/Journey/aplication/journey.routes.ts"], // Ruta a los archivos donde se definen las rutas de la API
};

// Init swagger

const specs = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));


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
