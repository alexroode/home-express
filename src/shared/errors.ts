export class AppError extends Error {
  status = 500;
  details?: any = null;
  url?: string = null;
  method?: string = null;

  constructor(message: string, statusCode: number, details: any = null) {
    super(message);
    this.status = statusCode;
    this.details = details;
  }
}

export const NotFound = new AppError("Not found", 404);