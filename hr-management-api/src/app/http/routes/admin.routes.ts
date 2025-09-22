import { Router } from "express";
import { requireAuth } from "../../../infra/auth/session.js";
import { requireRole } from "../middlewares/role.guard.js";
import { listManagers, updateManager } from "../controllers/admin.controller.js";

const r = Router();

r.get("/managers", requireAuth, requireRole("Admin"), listManagers);
r.put("/managers/:id", requireAuth, requireRole("Admin"), updateManager);

export default r;
