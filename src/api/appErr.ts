export class AppError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    
    // Mempertahankan stack trace (khusus Node.js)
    Error.captureStackTrace(this, this.constructor);
  }
}