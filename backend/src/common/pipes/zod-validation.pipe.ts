import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ZodSchema, ZodError } from 'zod';
import { ValidationException } from '../exceptions/business.exception';

/**
 * Zod validation pipe for validating request data using Zod schemas
 * Usage: @Body(new ZodValidationPipe(createUserSchema))
 */
@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: any) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: Record<string, string[]> = {};

        error.errors.forEach((err) => {
          const path = err.path.join('.');
          if (!errors[path]) {
            errors[path] = [];
          }
          errors[path].push(err.message);
        });

        throw new ValidationException('Validation failed', errors);
      }
      throw new BadRequestException('Validation failed');
    }
  }
}
