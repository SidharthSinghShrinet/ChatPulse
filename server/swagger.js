import swaggerAutogen from "swagger-autogen";

const doc = {
  openapi: "3.0.0",
  info: {
    title: "ChatPulse API Documentation",
    description: "Auto-generated OpenAPI Documentation for Real-Time Chat Application",
    version: "1.0.0",
  },
  servers: [
    {
      url: "/",
      description: "Current Server",
    },
  ],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "token",
        description: "JWT token in httpOnly cookie",
      },
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./app.js"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc).then(() => {
  console.log("Swagger documentation generated successfully into swagger-output.json");
});
