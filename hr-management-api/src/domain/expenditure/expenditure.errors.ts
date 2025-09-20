export type ExpenditureErrorCode =
  | "EXPENDITURE_TYPE_NOT_FOUND"
  | "EXPENDITURE_REQUEST_NOT_FOUND"
  | "INVALID_RANGE"               
  | "INVALID_AMOUNT"
  | "INVALID_CURRENCY"
  | "INVALID_STATUS_TRANSITION"   
  | "FORBIDDEN";

export class ExpenditureError extends Error {
  readonly code: ExpenditureErrorCode;
  readonly cause?: unknown;
  constructor(code: ExpenditureErrorCode, message: string, cause?: unknown) {
    super(message);
    this.code = code;
    this.cause = cause;
    this.name = "ExpenditureError";
  }
}

export class ExpenditureTypeNotFoundError extends ExpenditureError {
  constructor(message = "Expenditure type not found") {
    super("EXPENDITURE_TYPE_NOT_FOUND", message);
  }
}
export class ExpenditureRequestNotFoundError extends ExpenditureError {
  constructor(message = "Expenditure request not found") {
    super("EXPENDITURE_REQUEST_NOT_FOUND", message);
  }
}
export class InvalidStatusTransitionError extends ExpenditureError {
  constructor(message = "Invalid status transition") {
    super("INVALID_STATUS_TRANSITION", message);
  }
}
