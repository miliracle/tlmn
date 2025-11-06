import { HttpStatus } from '@nestjs/common';
import { AppException } from './base.exception';

/**
 * Business logic exception - for domain-specific errors
 */
export class BusinessException extends AppException {
  constructor(
    message: string,
    code?: string,
    metadata?: Record<string, any>,
  ) {
    super(message, HttpStatus.BAD_REQUEST, code || 'BUSINESS_ERROR', metadata);
  }
}

/**
 * Validation exception - for input validation errors
 */
export class ValidationException extends AppException {
  constructor(
    message: string,
    errors?: Record<string, string[]>,
    metadata?: Record<string, any>,
  ) {
    super(
      message,
      HttpStatus.UNPROCESSABLE_ENTITY,
      'VALIDATION_ERROR',
      {
        ...metadata,
        ...(errors && { errors }),
      },
    );
  }
}

/**
 * Not found exception - for resource not found errors
 */
export class NotFoundException extends AppException {
  constructor(
    resource: string,
    identifier?: string | number,
    metadata?: Record<string, any>,
  ) {
    const message = identifier
      ? `${resource} with identifier '${identifier}' not found`
      : `${resource} not found`;

    super(message, HttpStatus.NOT_FOUND, 'NOT_FOUND', {
      ...metadata,
      resource,
      identifier,
    });
  }
}

/**
 * Conflict exception - for resource conflict errors (e.g., duplicate entries)
 */
export class ConflictException extends AppException {
  constructor(
    message: string,
    code?: string,
    metadata?: Record<string, any>,
  ) {
    super(message, HttpStatus.CONFLICT, code || 'CONFLICT', metadata);
  }
}

/**
 * Unauthorized exception - for authentication errors
 */
export class UnauthorizedException extends AppException {
  constructor(message: string = 'Unauthorized', metadata?: Record<string, any>) {
    super(message, HttpStatus.UNAUTHORIZED, 'UNAUTHORIZED', metadata);
  }
}

/**
 * Forbidden exception - for authorization errors
 */
export class ForbiddenException extends AppException {
  constructor(
    message: string = 'Forbidden - insufficient permissions',
    metadata?: Record<string, any>,
  ) {
    super(message, HttpStatus.FORBIDDEN, 'FORBIDDEN', metadata);
  }
}

