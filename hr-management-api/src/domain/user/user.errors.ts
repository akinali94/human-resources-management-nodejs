
export type DomainErrorCode =
  | "USER_NOT_FOUND"
  | "EMAIL_ALREADY_IN_USE"
  | "INVALID_CREDENTIALS"
  | "INACTIVE_USER"
  | "FORBIDDEN";

export class DomainError extends Error {
  readonly code: DomainErrorCode;
  readonly cause?: unknown;

  constructor(code: DomainErrorCode, message: string, cause?: unknown) {
    super(message);
    this.code = code;
    this.cause = cause;
    this.name = "DomainError";
  }
}

export class UserNotFoundError extends DomainError {
  constructor(message = "User not found") {
    super("USER_NOT_FOUND", message);
  }
}

export class EmailAlreadyInUseError extends DomainError {
  constructor(message = "Email is already in use") {
    super("EMAIL_ALREADY_IN_USE", message);
  }
}

export class InvalidCredentialsError extends DomainError {
  constructor(message = "Invalid email or password") {
    super("INVALID_CREDENTIALS", message);
  }
}

export class InactiveUserError extends DomainError {
  constructor(message = "User account is inactive") {
    super("INACTIVE_USER", message);
  }
}

export class ForbiddenError extends DomainError {
  constructor(message = "You do not have permission to perform this action") {
    super("FORBIDDEN", message);
  }
}
