import { Router } from "express";
import { login, me, logout } from "../controllers/auth.controller.js";
import { requireAuth } from "../../../infra/auth/session.js";


const r = Router();

r.post("/login", login);
r.post("/logout", logout);
r.get("/me", requireAuth, me);

export default r;