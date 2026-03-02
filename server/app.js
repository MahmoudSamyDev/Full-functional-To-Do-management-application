const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const app = express();

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "To-Do Management API",
      version: "1.0.0",
      description:
        "A comprehensive To-Do management application with Kanban boards, sections, and tasks",
      contact: {
        name: "API Support",
        email: "support@todoapp.com",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: "http://localhost:3000/api/v1",
        description: "Development server",
      },
      {
        url: "https://your-production-url.com/api/v1",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          required: ["username"],
          properties: {
            _id: {
              type: "string",
              description: "Unique identifier for the user",
            },
            username: {
              type: "string",
              minLength: 8,
              description: "Unique username (minimum 8 characters)",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Board: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "Unique identifier for the board",
            },
            user: {
              type: "string",
              description: "ID of the user who owns this board",
            },
            icon: {
              type: "string",
              default: "📃",
              description: "Emoji icon for the board",
            },
            title: {
              type: "string",
              default: "Untitled",
              description: "Board title",
            },
            description: {
              type: "string",
              description: "Board description",
            },
            position: {
              type: "number",
              description: "Position order of the board",
            },
            favourite: {
              type: "boolean",
              description: "Whether the board is marked as favourite",
            },
            favouritePosition: {
              type: "number",
              description: "Position order among favourite boards",
            },
            sections: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Section",
              },
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Section: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "Unique identifier for the section",
            },
            board: {
              type: "string",
              description: "ID of the board this section belongs to",
            },
            title: {
              type: "string",
              description: "Section title (e.g., To Do, In Progress, Done)",
            },
            tasks: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Task",
              },
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Task: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "Unique identifier for the task",
            },
            section: {
              type: "string",
              description: "ID of the section this task belongs to",
            },
            title: {
              type: "string",
              description: "Task title",
            },
            content: {
              type: "string",
              description: "Task content/description",
            },
            position: {
              type: "number",
              description: "Position order of the task within the section",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        AuthRequest: {
          type: "object",
          required: ["username", "password"],
          properties: {
            username: {
              type: "string",
              minLength: 8,
              description: "Username (minimum 8 characters)",
            },
            password: {
              type: "string",
              minLength: 8,
              description: "Password (minimum 8 characters)",
            },
          },
        },
        SignupRequest: {
          type: "object",
          required: ["username", "password", "confirmPassword"],
          properties: {
            username: {
              type: "string",
              minLength: 8,
              description: "Username (minimum 8 characters)",
            },
            password: {
              type: "string",
              minLength: 8,
              description: "Password (minimum 8 characters)",
            },
            confirmPassword: {
              type: "string",
              minLength: 8,
              description: "Password confirmation (must match password)",
            },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            data: {
              type: "object",
              properties: {
                user: {
                  $ref: "#/components/schemas/User",
                },
                token: {
                  type: "string",
                  description: "JWT authentication token",
                },
              },
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            errors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  param: {
                    type: "string",
                    description: "Parameter that caused the error",
                  },
                  msg: {
                    type: "string",
                    description: "Error message",
                  },
                },
              },
            },
          },
        },
        UpdatePositionRequest: {
          type: "object",
          properties: {
            resourceList: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Task",
              },
              description: "List of tasks in the source section after reordering",
            },
            destinationList: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Task",
              },
              description: "List of tasks in the destination section after reordering",
            },
            resourceColumnId: {
              type: "string",
              description: "ID of the source section",
            },
            destinationColumnId: {
              type: "string",
              description: "ID of the destination section",
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/v1/routes/*.js"],
};

const swaggerSpecs = swaggerJsdoc(swaggerOptions);

app.use(
  cors({
    origin: "http://localhost:5000",
    credentials: true,
  }),
);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Swagger UI
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpecs, {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "To-Do Management API Documentation",
  }),
);

app.use("/api/v1", require("./src/v1/routes"));

module.exports = app;
