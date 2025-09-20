import { Router } from "express";
import { list } from "../controllers/leave-types.controller.js";
import { requireAuth } from "../../../infra/auth/session.js";

const r = Router();

r.get("/", requireAuth, list);

export default r;
