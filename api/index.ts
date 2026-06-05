import express, { Express, Request, Response } from "express";
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

// API JSON endpoint
app.get("/api-json", (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(specs);
});

// Custom Swagger UI HTML - Funciona mejor en Vercel
app.get('/api-docs', (req: Request, res: Response) => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Flight Manager API Docs</title>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@3/swagger-ui.css">
        <style>
          html { box-sizing: border-box; overflow: -moz-scrollbars-vertical; overflow-y: scroll; }
          *, *:before, *:after { box-sizing: inherit; }
          body { margin:0; padding: 0; }
        </style>
      </head>
      <body>
        <div id="swagger-ui"></div>
        <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@3/swagger-ui-bundle.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@3/swagger-ui-standalone-preset.js"></script>
        <script>
          window.onload = function() {
            const ui = SwaggerUIBundle({
              url: "/api-json",
              dom_id: '#swagger-ui',
              deepLinking: true,
              presets: [
                SwaggerUIBundle.presets.apis,
                SwaggerUIStandalonePreset
              ],
              plugins: [
                SwaggerUIBundle.plugins.DownloadUrl
              ],
              layout: "StandaloneLayout"
            });
            window.ui = ui;
          };
        </script>
      </body>
    </html>
  `;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(html);
});

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
