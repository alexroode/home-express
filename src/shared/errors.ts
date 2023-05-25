import createError from "@fastify/error";

export class AppError extends Error {
  statusCode = 500;
  details?: any = null;
  url?: string = null;
  method?: string = null;

  constructor(message: string, statusCode: number, details: any = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

export const NotFound = createError("NOT_FOUND", "Not found", 404);