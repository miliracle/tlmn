import { z } from 'zod';

/**
 * Zod schemas for table endpoints
 */

export const createTableSchema = z
  .object({
    config: z
      .object({
        playerCount: z.number().int().min(2).max(4).optional(),
        gameCount: z.number().int().min(1).optional(),
      })
      .optional(),
    playerCount: z.number().int().min(2).max(4).optional(),
    gameCount: z.number().int().min(1).optional(),
  })
  .refine((data) => data.config || data.playerCount !== undefined || data.gameCount !== undefined, {
    message: 'Either config or playerCount/gameCount must be provided',
  });
