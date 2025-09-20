import type { Role } from "../domain/user/user.entity";

declare module "express-serve-static-core" {
  interface Request {
    auth?: {
      userId: string;
      role: Role;
      companyId?: string;
    };
  }
}