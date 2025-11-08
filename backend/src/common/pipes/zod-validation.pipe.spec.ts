import { BadRequestException } from '@nestjs/common';
import { ZodValidationPipe } from './zod-validation.pipe';
import { z } from 'zod';
import { ValidationException } from '../exceptions/business.exception';

describe('ZodValidationPipe', () => {
  const testSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email format'),
    age: z.number().int().min(18, 'Age must be at least 18'),
  });

  let pipe: ZodValidationPipe;

  beforeEach(() => {
    pipe = new ZodValidationPipe(testSchema);
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  it('should transform valid data', () => {
    const validData = {
      name: 'John Doe',
      email: 'john@example.com',
      age: 25,
    };

    const result = pipe.transform(validData);
    expect(result).toEqual(validData);
  });

  it('should throw ValidationException for invalid data', () => {
    const invalidData = {
      name: '',
      email: 'invalid-email',
      age: 15,
    };

    expect(() => pipe.transform(invalidData)).toThrow(ValidationException);
  });

  it('should provide detailed validation errors', () => {
    const invalidData = {
      name: '',
      email: 'invalid-email',
      age: 15,
    };

    try {
      pipe.transform(invalidData);
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationException);
      expect(error.getResponse()).toHaveProperty('metadata');
    }
  });

  it('should handle missing required fields', () => {
    const invalidData = {
      email: 'test@example.com',
    };

    expect(() => pipe.transform(invalidData)).toThrow(ValidationException);
  });

  it('should handle type mismatches', () => {
    const invalidData = {
      name: 'John',
      email: 'john@example.com',
      age: 'not-a-number',
    };

    expect(() => pipe.transform(invalidData)).toThrow(ValidationException);
  });

  it('should throw BadRequestException for non-Zod errors', () => {
    // Create a pipe with a schema that might cause non-Zod errors
    const pipeWithError = new ZodValidationPipe(testSchema);

    // Mock a scenario where parse might throw a non-Zod error
    // This is a bit contrived, but tests the error handling
    jest.spyOn(testSchema, 'parse').mockImplementation(() => {
      throw new Error('Non-Zod error');
    });

    expect(() => pipeWithError.transform({})).toThrow(BadRequestException);
  });
});
