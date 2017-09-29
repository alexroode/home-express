export class AppError extends Error {
  status = 500;

  constructor(message: string, statusCode: number) {
    super(message);
    this.status = statusCode;
  }
}

export const NotFound = new AppError("Not found", 404);