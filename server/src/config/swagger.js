import swaggerUi from "swagger-ui-express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to auto-generated swagger file
const swaggerFilePath = path.resolve(__dirname, "../../swagger-output.json");

export const setupSwagger = (app) => {
  try {
    if (fs.existsSync(swaggerFilePath)) {
      const swaggerDocument = JSON.parse(fs.readFileSync(swaggerFilePath, "utf8"));
      swaggerDocument.servers = [
        {
          url: "/",
          description: "Current Server",
        },
      ];
      app.use(
        "/api-docs",
        swaggerUi.serve,
        swaggerUi.setup(swaggerDocument, {
          customCss: ".swagger-ui .topbar { display: none }",
          customSiteTitle: "ChatPulse API Docs (Auto-generated)",
        })
      );
      console.log("Swagger UI available at /api-docs");
    } else {
      console.warn("swagger-output.json not found. Run 'npm run swagger' to generate it.");
    }
  } catch (error) {
    console.error("Failed to load Swagger documentation:", error.message);
  }
};
