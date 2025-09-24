import type { CreateEmployeeBody, UpdateEmployeeBody } from "../dtos/manager.dto.js";
import { Roles, type Role, type CreateUserInput, type UpdateUserInput } from "../../../domain/user/user.entity.js";


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

export function toCreateUserInputFromEmployeeBody(params: {
  body: CreateEmployeeBody;
  rawPassword: string;
  role: string;
  companyId: string;
  advanceAmount: number;
  maxAdvanceAmount: number;
}): CreateUserInput {
  const { body, rawPassword, role, companyId, advanceAmount, maxAdvanceAmount } = params;

  const getRole = getRoleFromString(role)

  return {
    email: body.email,
    passwordHash: rawPassword,
    firstName: body.firstName,
    lastName: body.lastName,
    title: body.title,
    section: body.section,
    phoneNo: body.phoneNo,
    address: body.address,
    salary: body.salary,

    role: getRole,
    companyId: companyId,
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

export function toUpdateUserInputFromEmployeeBody(body: UpdateEmployeeBody, role: string, companyId: string): UpdateUserInput {

  const getRole = getRoleFromString(role)

  return {
    //required
    email: body.email,
    firstName: body.firstName,
    lastName: body.lastName,
    isActive: body.isActive,
    title: body.title,
    section: body.section,
    phoneNo: body.phoneNo,
    address: body.address,
    role: getRole,
    companyId: companyId,

    salary: body.salary,
    maxAdvanceAmount: body.salary*2/3,

    //nullable
    secondName: body.secondName ?? null,
    secondLastName: body.secondLastName ?? null,
    birthPlace: body.birthPlace ?? null,
    identityNumber: body.nationalId ?? null,

    hiredDate: body.hiredDate ?? null,
    resignationDate: body.resignationDate ?? null,

    imageUrl: body.imageUrl ?? null,
    backgroundImageUrl: body.backgroundImageUrl ?? null,
  }
}

