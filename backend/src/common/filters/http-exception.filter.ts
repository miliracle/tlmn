import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AppException } from '../exceptions/base.exception';

/**
 * Global exception filter that catches all exceptions and formats them consistently.
 * Handles both custom AppException and standard NestJS HttpException.
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let errorResponse: any;

    if (exception instanceof AppException) {
      // Handle custom application exceptions
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse() as any;
      errorResponse = {
        ...exceptionResponse,
        path: request.url,
        method: request.method,
      };

      // Log business/validation errors at warn level, others at error level
      if (status < 500) {
        this.logger.warn(
          `${request.method} ${request.url} - ${status} - ${exceptionResponse.message}`,
        );
      } else {
        this.logger.error(
          `${request.method} ${request.url} - ${status} - ${exceptionResponse.message}`,
          exception.stack,
        );
      }
    } else if (exception instanceof HttpException) {
      // Handle standard NestJS HttpExceptions
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      errorResponse = {
        message:
          typeof exceptionResponse === 'string'
            ? exceptionResponse
            : (exceptionResponse as any).message || exception.message,
        code: this.getErrorCode(status),
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
        ...(typeof exceptionResponse === 'object' &&
          !(exceptionResponse as any).message && { ...exceptionResponse }),
      };

      this.logger.warn(`${request.method} ${request.url} - ${status} - ${errorResponse.message}`);
    } else {
      // Handle unexpected errors (non-HTTP exceptions)
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      const error = exception as Error;

      errorResponse = {
        message:
          process.env.NODE_ENV === 'production'
            ? 'Internal server error'
            : error.message || 'An unexpected error occurred',
        code: 'INTERNAL_SERVER_ERROR',
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
        ...(process.env.NODE_ENV !== 'production' && {
          stack: error.stack,
        }),
      };

      this.logger.error(
        `${request.method} ${request.url} - ${status} - ${error.message}`,
        error.stack,
      );
    }

    response.status(status).json(errorResponse);
  }

  /**
   * Get error code from HTTP status
   */
  private getErrorCode(status: number): string {
    const codeMap: Record<number, string> = {
      [HttpStatus.BAD_REQUEST]: 'BAD_REQUEST',
      [HttpStatus.UNAUTHORIZED]: 'UNAUTHORIZED',
      [HttpStatus.FORBIDDEN]: 'FORBIDDEN',
      [HttpStatus.NOT_FOUND]: 'NOT_FOUND',
      [HttpStatus.METHOD_NOT_ALLOWED]: 'METHOD_NOT_ALLOWED',
      [HttpStatus.CONFLICT]: 'CONFLICT',
      [HttpStatus.UNPROCESSABLE_ENTITY]: 'UNPROCESSABLE_ENTITY',
      [HttpStatus.INTERNAL_SERVER_ERROR]: 'INTERNAL_SERVER_ERROR',
      [HttpStatus.BAD_GATEWAY]: 'BAD_GATEWAY',
      [HttpStatus.SERVICE_UNAVAILABLE]: 'SERVICE_UNAVAILABLE',
    };

    return codeMap[status] || 'UNKNOWN_ERROR';
  }
}
