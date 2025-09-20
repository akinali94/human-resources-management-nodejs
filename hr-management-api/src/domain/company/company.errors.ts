export type CompanyErrorCode =
  | "COMPANY_NOT_FOUND"
  | "COMPANY_NAME_TAKEN"
  | "INVALID_CONTRACT_DATES"; // start > end vb.

export class CompanyError extends Error {
  readonly code: CompanyErrorCode;
  readonly cause?: unknown;
  constructor(code: CompanyErrorCode, message: string, cause?: unknown) {
    super(message);
    this.name = "CompanyError";
    this.code = code;
    this.cause = cause;
  }
}

export class CompanyNotFoundError extends CompanyError {
  constructor(message = "Company not found") {
    super("COMPANY_NOT_FOUND", message);
  }
}
