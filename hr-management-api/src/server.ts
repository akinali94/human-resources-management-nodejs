import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./app/http/routes/auth.routes.js"
import { errorMiddleware } from "./app/http/middlewares/error.middleware.js"
import { env } from "./config/env.js"


const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/employees", employeesRoutes)

app.use(errorMiddleware);


app.listen(Number(env.PORT), () => {
    console.log(`Server listening on http://localhost:${env.PORT}`);
});