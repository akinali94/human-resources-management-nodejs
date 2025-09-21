import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./app/http/routes/auth.routes.js"
import employeesRoutes from "./app/http/routes/employees.routes.js"
import leaveRequestsRoutes from "./app/http/routes/leave-requests.routes.js";
import leaveTypesRoutes from "./app/http/routes/leave-types.routes.js";
import expendituresRoutes from "./app/http/routes/expenditures.routes.js";
import companyRoutes from "./app/http/routes/company.routes.js";
import cors from "cors";
import { errorMiddleware } from "./app/http/middlewares/error.middleware.js"
import { env } from "./config/env.js"
import { buildCorsOptions } from "./config/cors.js";



const app = express();

app.use(express.json());
app.use(cookieParser());

const corsOptions = buildCorsOptions();
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use("/api/auth", authRoutes);
app.use("/api/employees", employeesRoutes)
app.use("/api/leave-requests", leaveRequestsRoutes);
app.use("/api/leave-types", leaveTypesRoutes);
app.use("/api/expenditures", expendituresRoutes);
app.use("/api/companies", companyRoutes);

app.use(errorMiddleware);



app.listen(Number(env.PORT), () => {
    console.log(`Server listening on http://localhost:${env.PORT}`);
});