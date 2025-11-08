import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Base exception class for all custom application exceptions.
 * Provides a consistent structure for error handling across the application.
 */
export class AppException extends HttpException {
  /**
   * Error code for programmatic error handling
   */
  public readonly code: string;

  /**
   * Additional context/metadata about the error
   */
  public readonly metadata?: Record<string, any>;

  constructor(
    message: string,
    statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    code?: string,
    metadata?: Record<string, any>,
  ) {
    const errorCode = code || AppException.getDefaultCode(statusCode);

    super(
      {
        message,
        code: errorCode,
        statusCode,
        timestamp: new Date().toISOString(),
        ...(metadata && { metadata }),
      },
      statusCode,
    );

    this.code = errorCode;
    this.metadata = metadata;
  }

  /**
   * Get default error code based on HTTP status
   */
  private static getDefaultCode(statusCode: HttpStatus): string {
    const codeMap: Record<number, string> = {
      [HttpStatus.BAD_REQUEST]: 'BAD_REQUEST',
      [HttpStatus.UNAUTHORIZED]: 'UNAUTHORIZED',
      [HttpStatus.FORBIDDEN]: 'FORBIDDEN',
      [HttpStatus.NOT_FOUND]: 'NOT_FOUND',
      [HttpStatus.CONFLICT]: 'CONFLICT',
      [HttpStatus.UNPROCESSABLE_ENTITY]: 'UNPROCESSABLE_ENTITY',
      [HttpStatus.INTERNAL_SERVER_ERROR]: 'INTERNAL_SERVER_ERROR',
      [HttpStatus.SERVICE_UNAVAILABLE]: 'SERVICE_UNAVAILABLE',
    };

    return codeMap[statusCode] || 'UNKNOWN_ERROR';
  }
}
