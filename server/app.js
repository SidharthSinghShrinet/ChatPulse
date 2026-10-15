import express from "express";
import morgan from "morgan";
import cors from "cors";
import error from "./src/middlewares/error.middleware.js"
import userRoutes from "./src/routes/user.routes.js"
import messageRoutes from "./src/routes/message.routes.js"
import cookieParser from "cookie-parser";
import { setupSwagger } from "./src/config/swagger.js";
import { corsOptions } from "./src/config/cors.js";

const app = express();

// Trust reverse proxy for secure cookies on Render
app.set("trust proxy", 1);

app.use(cors(corsOptions));

app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Swagger Documentation UI
setupSwagger(app);

// Health Check Route
app.get("/", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "BaatCheet Backend Is Running",
    });
});

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/messages", messageRoutes);

app.use(error);

export default app;