import { Router } from "express";
import { requireAuth } from "../../../infra/auth/session.js";
import { requireRole } from "../middlewares/role.guard.js";
import { list, create, detail, update, remove, myCompany } from "../controllers/company.controller.js";

const r = Router();

// Everyone logged-in can list & view
r.get("/", requireAuth, list);
r.get("/me", requireAuth, myCompany);
r.get("/:id", requireAuth, detail);

// Admin-only mutations
r.post("/", requireAuth, requireRole("Admin"), create);
r.put("/:id", requireAuth, requireRole("Admin"), update);
r.delete("/:id", requireAuth, requireRole("Admin"), remove);

export default r;
