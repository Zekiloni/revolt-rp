import { z } from 'zod';

export const vector3Schema = z.object({
  x: z.number(),
  y: z.number(),
  z: z.number()
});

export type Vector3Input = z.infer<typeof vector3Schema>;

export const vehicleListQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(500).catch(50),
  offset: z.coerce.number().int().min(0).catch(0)
});

export const vehicleCreateSchema = z.object({
  model: z.string().min(1),
  color: z.tuple([
    z.tuple([z.number(), z.number(), z.number()]),
    z.tuple([z.number(), z.number(), z.number()])
  ]),
  position: vector3Schema,
  rotation: vector3Schema,
  price: z.number().nonnegative().optional(),
  dimension: z.number().int().optional(),
  fuel: z.number().min(0).max(100).optional(),
  engine: z.boolean().optional(),
  locked: z.boolean().optional(),
  owner: z.string().optional(),
  organization: z.string().optional()
});

export type VehicleCreateInput = z.infer<typeof vehicleCreateSchema>;

export const vehicleUpdateSchema = vehicleCreateSchema.partial().extend({
  rev: z.number().int().optional(),
  mileage: z.number().nonnegative().optional(),
  bodyHealth: z.number().optional(),
  engineHealth: z.number().optional(),
  isSpawned: z.boolean().optional()
});

export type VehicleUpdateInput = z.infer<typeof vehicleUpdateSchema>;
