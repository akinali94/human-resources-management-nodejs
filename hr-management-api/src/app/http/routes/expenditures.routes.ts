import { Router } from "express";
import { requireAuth } from "../../../infra/auth/session.js";
import { requireRole } from "../middlewares/role.guard.js";
import {
  listTypes,
  listMyRequests,
  createRequest,
  listPendingRequests,
  approveRequest,
  rejectRequest,
  requestDetail,
} from "../controllers/expenditures.controller.js";

const r = Router();

// Types
r.get("/types", requireAuth, listTypes);

// Employee
r.get("/requests/my", requireAuth, listMyRequests);
r.post("/requests", requireAuth, createRequest);

// Manager/Admin
r.get("/requests/pending", requireAuth, requireRole("Manager", "Admin"), listPendingRequests);
r.post("/requests/:id/approve", requireAuth, requireRole("Manager", "Admin"), approveRequest);
r.post("/requests/:id/reject", requireAuth, requireRole("Manager", "Admin"), rejectRequest);

// Detail
r.get("/requests/:id", requireAuth, requestDetail);

export default r;
