export const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Intern Assignment API",
      version: "1.0.0",
      description: "Versioned REST API with JWT auth and RBAC"
    },
    servers: [{ url: "http://localhost:5000" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    }
  },
  apis: []
};
