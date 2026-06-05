export const swaggerDefinition = {
  openapi: "3.0.3",
  info: {
    title: "Flight Manager API",
    version: "1.0.0",
    description: "API REST de gestión de viajes y vuelos",
    contact: {
      name: "Support",
      email: "support@example.com"
    }
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Desarrollo local"
    },
    {
      url: "https://viajeporcolombiaapi.projects.omag.cloud/",
      description: "Producción"
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Ingresa tu token JWT aquí"
      }
    },
    schemas: {
      Journey: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            description: "ID único del viaje"
          },
          Origin: {
            type: "string",
            description: "Aeropuerto de origen (ej: MAD)"
          },
          Destination: {
            type: "string",
            description: "Aeropuerto de destino (ej: NYC)"
          },
          price: {
            type: "number",
            format: "decimal",
            description: "Precio del viaje"
          }
        },
        required: ["Origin", "Destination", "price"]
      },
      Error: {
        type: "object",
        properties: {
          status: {
            type: "integer"
          },
          message: {
            type: "string"
          }
        }
      }
    }
  },
  paths: {
    "/": {
      get: {
        summary: "Health check",
        description: "Verificar que el servidor está activo",
        tags: ["General"],
        responses: {
          200: {
            description: "Servidor activo"
          }
        }
      }
    },
    "/health": {
      get: {
        summary: "Health check detallado",
        description: "Verificar estado del servidor",
        tags: ["General"],
        responses: {
          200: {
            description: "Estado del servidor",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: {
                      type: "string"
                    },
                    timestamp: {
                      type: "string",
                      format: "date-time"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/tk": {
      post: {
        summary: "Generar token JWT",
        description: "Obtener un token JWT para autenticación",
        tags: ["Autenticación"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  username: {
                    type: "string"
                  },
                  password: {
                    type: "string"
                  }
                },
                required: ["username", "password"]
              }
            }
          }
        },
        responses: {
          200: {
            description: "Token generado exitosamente",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    token: {
                      type: "string",
                      description: "JWT token"
                    }
                  }
                }
              }
            }
          },
          400: {
            description: "Datos inválidos"
          }
        }
      }
    },
    "/journey": {
      post: {
        summary: "Buscar viajes y vuelos",
        description: "Obtiene y consulta los vuelos o las rutas para hacer un viaje. Límite: 50,000 consultas/hora.",
        tags: ["Viajes"],
        security: [
          {
            bearerAuth: []
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  Origins: {
                    type: "string",
                    description: "Código aeropuerto de origen (ej: MAD)",
                    example: "MAD"
                  },
                  Destiny: {
                    type: "string",
                    description: "Código aeropuerto de destino (ej: NYC)",
                    example: "NYC"
                  }
                },
                required: ["Origins", "Destiny"]
              }
            }
          }
        },
        responses: {
          200: {
            description: "Viajes encontrados exitosamente",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Journey"
                  }
                }
              }
            }
          },
          400: {
            description: "Datos de entrada inválidos"
          },
          401: {
            description: "No se envió el token o token inválido"
          },
          404: {
            description: "No se encontraron rutas disponibles"
          },
          500: {
            description: "Error interno del servidor"
          }
        }
      }
    }
  }
};
