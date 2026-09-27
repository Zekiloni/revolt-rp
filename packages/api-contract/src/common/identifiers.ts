import { z } from 'zod';

export const accountIdentifierSchema = z.object({
  type: z.string().min(1),
  value: z.string().min(1),
  label: z.string().optional()
});

export type AccountIdentifierInput = z.infer<typeof accountIdentifierSchema>;

export const gameSessionRequestSchema = z.object({
  identifiers: z.array(accountIdentifierSchema).min(1)
});

export type GameSessionRequest = z.infer<typeof gameSessionRequestSchema>;

export const playerFlagsResponseSchema = z.object({
  accountId: z.string().nullable(),
  banned: z.boolean(),
  whitelisted: z.boolean(),
  administrator: z.number(),
  mutedUntil: z.string().nullable()
});

export type PlayerFlagsResponse = z.infer<typeof playerFlagsResponseSchema>;
