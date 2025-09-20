import type { Request, Response } from "express";
import { UpdateMeBody } from "../dtos/employees.dto.js"
import { UserPrismaRepo } from "../../../infra/repositories/user.prisma.repo.js";

const userRepo = new UserPrismaRepo();

function sanitize(user: any){
    return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isActive: user.isActive,
        companyId: user.companyId ?? null,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
}

export async function getMe(req: Request & { auth?: { userId: string } }, res: Response) {
    if (!req.auth) 
        return res.status(401).json({ error: { code: "UNAUTHORIZED", message: "No session" } });
    
    const user = await userRepo.findById(req.auth.userId);
    if (!user) 
        return res.status(404).json({ error: { code: "NOT_FOUND", message: "User not found" } });
    return res.json(sanitize(user));
}


export async function updateMe(req: Request & { auth?: { userId: string } }, res: Response) {
    try {
        if (!req.auth)
            return res.status(401).json({ error: { code: "UNAUTHORIZED", message: "No session" } });

        const body = UpdateMeBody.parse(req.body);
        const first = body.firstName ?? undefined;
        const last = body.lastName ?? undefined;


        //First get the user(TODO: implement different logic)
        const existing = await userRepo.findById(req.auth.userId);
        if (!existing)
            return res.status(404).json({ error: { code: "NOT_FOUND", message: "User not found" } });


        const updated = await userRepo.updateName(
            req.auth.userId,
            first ?? existing.firstName,
            last ?? existing.lastName
        );

        return res.json(sanitize(updated));
        
    } catch (err: any) {
        if (err?.name === "ZodError") {
        return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: err.message } });
    }

    console.error(err);
    return res.status(500).json({ error: { code: "INTERNAL", message: "Internal Server Error" } });
    }
}