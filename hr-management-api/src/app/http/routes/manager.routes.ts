import { Router } from "express";
import { requireAuth } from "../../../infra/auth/session.js";
import { requireRole } from "../middlewares/role.guard.js";
import { getMyManagerInfo, getEmployee, listEmployeesByCompany, updateEmployee, createEmployee, deleteEmployee } from "../controllers/manager.controller.js";

const r = Router();

r.get("/me", requireAuth, requireRole("Manager"), getMyManagerInfo)
r.get("/employees", requireAuth, requireRole("Manager"), listEmployeesByCompany);
r.get("/employees/:id", requireAuth, requireRole("Manager"), getEmployee);
r.put("/employees/:id", requireAuth, requireRole("Manager"), updateEmployee);
r.post("/employees", requireAuth, requireRole("Manager"), createEmployee);
r.delete("/employees/:id", requireAuth, requireRole("Manager"), deleteEmployee)
export default r;