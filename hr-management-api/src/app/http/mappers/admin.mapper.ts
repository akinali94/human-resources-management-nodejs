import type { CreateManagerBody } from "../dtos/admin.dto.js";
import { Roles, type Role, type CreateUserInput } from "../../../domain/user/user.entity.js";


export function toCreateUserInputFromManagerBody(params: {
  body: CreateManagerBody;
  rawPassword: string;
  role: string;
  advanceAmount: number;
  maxAdvanceAmount: number;
}): CreateUserInput {
  const { body, rawPassword, role, advanceAmount, maxAdvanceAmount } = params;

  const getRole = getRoleFromString(role)

  return {
    email: body.email,
    passwordHash: rawPassword,
    firstName: body.firstName,
    lastName: body.lastName,
    companyId: body.companyId,
    title: body.title,
    section: body.section,
    phoneNo: body.phoneNo,
    address: body.address,
    salary: body.salary,

    role: getRole,
    advanceAmount: advanceAmount,
    maxAdvanceAmount: maxAdvanceAmount,

    //nullable
    secondName: body.secondName ?? null,
    secondLastName: body.secondLastName ?? null,
    birthPlace: body.birthPlace ?? null,
    identityNumber: body.nationalId ?? null,

    hiredDate: body.hiredDate ?? null,
    resignationDate: body.resignationDate ?? null,

    imageUrl: body.profileImageUrl ?? null,
    backgroundImageUrl: body.backgroundImageUrl ?? null,

    // isActive: true,
  };
}

function getRoleFromString(roleStr: string): Role {
  switch (roleStr.toLowerCase()) {
    case "manager":
      return Roles.Manager;
    case "admin":
      return Roles.Admin;
    case "employee":
      return Roles.Employee;
    default:
      throw new Error(`Invalid role string: ${roleStr}`);
  }
}