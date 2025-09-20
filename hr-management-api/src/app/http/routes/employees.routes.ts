import { Router } from "express";
import { getMe, updateMe } from "../controllers/employees.controller.js";
import { requireAuth } from "../../../infra/auth/session.js";


const r = Router();

r.get("/me", requireAuth, getMe);
r.put("/me", requireAuth, updateMe);

export default r;