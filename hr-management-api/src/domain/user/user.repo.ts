
import type { CreateUserInput, UpdateUserInput, Role, User } from "./user.entity.js";

export interface UserRepo {
  findById(id: string): Promise<User | null>;

  findByEmail(email: string): Promise<User | null>;

  create(input: CreateUserInput): Promise<User>;

  update(id: string, input: UpdateUserInput): Promise<User>;

  delete(id: string): Promise<User>;

  updateName(id: string, firstName: string, lastName: string): Promise<User>;

  setRole(id: string, role: Role): Promise<void>;

  setActive(id: string, isActive: boolean): Promise<void>;

  listManagers(): Promise<User[]>;
}
