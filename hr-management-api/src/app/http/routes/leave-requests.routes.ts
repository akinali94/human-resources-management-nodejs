import { Router } from "express";
import { requireAuth } from "../../../infra/auth/session.js";
import { requireRole } from "../middlewares/role.guard.js";
import { listMy, createDraft, submit, listPending, approve, reject, detail } from "../controllers/leave-requests.controller.js"


const r = Router();


// Employee
r.get("/my", requireAuth, listMy);
r.post("/", requireAuth, createDraft);
r.post("/:id/submit", requireAuth, submit);


// Manager
r.get("/pending", requireAuth, requireRole("Manager", "Admin"), listPending);
r.post("/:id/approve", requireAuth, requireRole("Manager", "Admin"), approve);
r.post("/:id/reject", requireAuth, requireRole("Manager", "Admin"), reject);


// Detail
r.get("/:id", requireAuth, detail);


export default r;