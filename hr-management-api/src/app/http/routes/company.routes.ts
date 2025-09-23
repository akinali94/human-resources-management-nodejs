import { Router } from "express";
import { requireAuth } from "../../../infra/auth/session.js";
import { requireRole } from "../middlewares/role.guard.js";
import { list, create, detail, update, remove, myCompany } from "../controllers/company.controller.js";

const r = Router();


r.get("/me", requireAuth, myCompany);

// Admin-only mutations
r.get("/", requireAuth, requireRole("Admin"), list);
r.get("/:id", requireAuth,requireRole("Admin"), detail);
r.post("/", requireAuth, requireRole("Admin"), create);
r.put("/:id", requireAuth, requireRole("Admin"), update);
r.delete("/:id", requireAuth, requireRole("Admin"), remove);

export default r;
