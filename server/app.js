import express from "express";
import morgan from "morgan";
import cors from "cors";
import error from "./src/middlewares/error.middleware.js"
import userRoutes from "./src/routes/user.routes.js"
import messageRoutes from "./src/routes/message.routes.js"
import cookieParser from "cookie-parser";
import { setupSwagger } from "./src/config/swagger.js";

const app = express();

app.use(cors({
    origin: ["http://localhost:5173", "http://192.168.7.6:5173", "http://192.168.7.5:5173"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true
}));

app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Swagger Documentation UI
setupSwagger(app);

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/messages", messageRoutes);

app.use(error);

export default app;