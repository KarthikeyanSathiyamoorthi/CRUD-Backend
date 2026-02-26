class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Marks it as a known error
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
export {};
// export default AppError;
