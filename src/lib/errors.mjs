export class AppError extends Error {
  constructor(code) {
    super('AppError');
    this.code = code;
  }
}
export const RUN_EXISTS = 'RUN_EXISTS';
export const RUN_NOT_EXIST = 'RUN_NOT_EXISTS';
export const CLAIM_FAILED = 'CLAIM_FAILED';
