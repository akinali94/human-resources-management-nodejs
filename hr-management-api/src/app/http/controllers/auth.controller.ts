import type { Request, Response } from "express";
import { LoginBody } from "../dtos/auth.dto.js";
import { UserPrismaRepo } from "../../../infra/repositories/user.prisma.repo.js"
import { verifyPassword } from "../../../infra/auth/password.js"
import { InactiveUserError, InvalidCredentialsError } from "../../../domain/user/user.errors.js";
import { clearSessionCookie, setSessionCookie, signSession } from "../../../infra/auth/session.js";

const userRepo = new UserPrismaRepo();


function sanitize(user: any) {
    return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isActive: user.isActive,
        companyId: user.companyId ?? null,
    };
}


export async function login(req: Request, res: Response) {
try {
const body = LoginBody.parse(req.body);
const user = await userRepo.findByEmail(body.email);
if (!user) throw new InvalidCredentialsError();


const ok = await verifyPassword(user.passwordHash, body.password);
if (!ok) throw new InvalidCredentialsError();
if (!user.isActive) throw new InactiveUserError();


const token = signSession(user.id, user.role as any);
setSessionCookie(res, token);
return res.json({ user: sanitize(user) });
} catch (err: any) {
if (err?.name === "ZodError") {
return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: err.message } });
}
if (err?.code === "INVALID_CREDENTIALS") {
return res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Invalid email or password" } });
}
if (err?.code === "INACTIVE_USER") {
return res.status(403).json({ error: { code: "FORBIDDEN", message: "User account is inactive" } });
}
console.error(err);
return res.status(500).json({ error: { code: "INTERNAL", message: "Internal Server Error" } });
}
}


export async function me(req: Request & { auth?: { userId: string } }, res: Response) {
if (!req.auth) return res.status(401).json({ error: { code: "UNAUTHORIZED", message: "No session" } });
const user = await userRepo.findById(req.auth.userId);
if (!user) return res.status(404).json({ error: { code: "NOT_FOUND", message: "User not found" } });
return res.json(sanitize(user));
}


export async function logout(_req: Request, res: Response) {
clearSessionCookie(res);
return res.status(204).send();
}