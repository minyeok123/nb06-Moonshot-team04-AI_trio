export class BaseError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
  }
}

export class TokenExpiredError extends BaseError {
  constructor(message = '토큰 만료') {
    super(message, 401);
  }
}
