export class AppError extends Error {
  code: string;
  constructor(code: string) {
    super('AppError');
    this.code = code;
  }
}

export const INSTANCE_EXISTS = 'INSTANCE_EXISTS';
export const RUN_EXISTS = 'RUN_EXISTS';
export const RUN_NOT_EXIST = 'RUN_NOT_EXISTS';
export const CLAIM_FAILED = 'CLAIM_FAILED';
