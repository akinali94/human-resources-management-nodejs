import jwt from "jsonwebtoken";
import type { Role } from "../../domain/user/user.entity.ts";
import type { Response, Request, NextFunction } from "express";
import { env } from "../../config/env.js"
import { prisma } from "../db/prisma.client.js";


const COOKIE_NAME = "session";
const WEEK = 30 * 60; // seconds


export function signSession(userId: string, role: Role) {
    const token = jwt.sign({ sub: userId, role }, env.JWT_SECRET, { algorithm: "HS256", expiresIn: WEEK });
    return token;
}


export function setSessionCookie(res: Response, token: string) {
    const isProd = env.NODE_ENV === "production";
    res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: WEEK * 1000,
    path: "/",
    });
}


export function clearSessionCookie(res: Response) {
    const isProd = env.NODE_ENV === "production";
    res.cookie(COOKIE_NAME, "", {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    expires: new Date(0),
    path: "/",
    });
}

//we will add company scope on middleware, because of this companyId is optional
export type AuthPayload = { userId: string; role: Role; companyId?: string };


export function requireAuth(req: Request & { auth?: AuthPayload }, res: Response, next: NextFunction) {
    try {
        const raw = req.cookies?.[COOKIE_NAME];
        if (!raw) return res.status(401).json({ error: { code: "UNAUTHORIZED", message: "No session" } });
        const decoded = jwt.verify(raw, env.JWT_SECRET) as any;
        req.auth = { userId: decoded.sub as string, role: decoded.role as Role };
        next();
    } catch (e) {
        return res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Invalid session" } });
    }
}


export function optionalAuth(req: Request & { auth?: AuthPayload }, _res: Response, next: NextFunction) {
    try {
        const raw = req.cookies?.[COOKIE_NAME];
        if (raw) {
        const decoded = jwt.verify(raw, env.JWT_SECRET) as any;
        req.auth = { userId: decoded.sub as string, role: decoded.role as Role };
        }
    } catch {}
        next();
}