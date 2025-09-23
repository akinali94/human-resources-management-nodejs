import { Router } from "express";
import { requireAuth } from "../../../infra/auth/session.js";
import { requireRole } from "../middlewares/role.guard.js";
import { listManagers, updateManager, getManager, createManager } from "../controllers/admin.controller.js";

const r = Router();

r.get("/managers", requireAuth, requireRole("Admin"), listManagers);
r.get("/managers/:id", requireAuth, requireRole("Admin"), getManager);
r.put("/managers/:id", requireAuth, requireRole("Admin"), updateManager);
r.post("/managers", requireAuth, requireRole("Admin"), createManager);

export default r;
