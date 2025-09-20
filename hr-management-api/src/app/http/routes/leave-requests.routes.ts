import { Router } from "express";
import { requireAuth } from "../../../infra/auth/session.js";
import { requireRole } from "../middlewares/role.guard.js";
import * as c from "../controllers/leave-requests.controller.js"
import { requireCompanyScope } from "../middlewares/company.scope.guard.js";

const r = Router();


// Employee
r.get("/my", requireAuth, c.listMy);
r.post("/", requireAuth, c.createDraft);
r.post("/:id/submit", requireAuth, c.submit);


// Manager
r.get("/pending", requireAuth, requireRole("Manager", "Admin"), c.listPending);
r.post("/:id/approve", requireAuth, requireRole("Manager", "Admin"), c.approve);
r.post("/:id/reject", requireAuth, requireRole("Manager", "Admin"), c.reject);
r.get("/pending", requireAuth, requireRole("Manager", "Admin"), requireCompanyScope, c.listPending);
r.post("/:id/approve", requireAuth, requireRole("Manager", "Admin"), requireCompanyScope, c.approve);
r.post("/:id/reject", requireAuth, requireRole("Manager", "Admin"), requireCompanyScope, c.reject);

// Detail
r.get("/:id", requireAuth, c.detail);


export default r;