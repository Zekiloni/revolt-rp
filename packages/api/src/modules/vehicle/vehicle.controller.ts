import { Router } from 'express';
import { FilterQuery } from 'mongoose';
import { apiError, vehicleCreateSchema, vehicleListQuerySchema, vehicleUpdateSchema } from '@revolt-rp/api-contract';
import { Vehicle } from '@revolt-rp/core';
import { allowActor, authenticate } from '../../core/auth.middleware';
import { createVehicle, deleteVehicle, getAllVehicles, getVehicleById, updateVehicle } from './vehicle.service';

const router = Router();

router.get('', async (req, res) => {
  const { limit, offset } = vehicleListQuerySchema.parse(req.query);

  const filter = { ...req.query } as Record<string, unknown>;
  delete filter.limit;
  delete filter.offset;

  const [vehicles, total] = await getAllVehicles(filter as FilterQuery<Vehicle>, limit, offset);

  return res.status(200).json({ vehicles, total });
});

router.get('/:id', async (req, res) => {
  const vehicle = await getVehicleById(req.params.id);

  if (!vehicle) {
    return res.status(404).json(apiError('NOT_FOUND', 'Vehicle not found'));
  }

  return res.status(200).json({ vehicle });
});

router.post('', authenticate, allowActor('admin', 'service'), async (req, res) => {
  const parsed = vehicleCreateSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(422).json(apiError('VALIDATION_FAILED', 'Invalid vehicle payload', parsed.error.issues));
  }

  const vehicle = await createVehicle(parsed.data);

  return res.status(201).json({ vehicle });
});

router.patch('/:id', authenticate, allowActor('admin', 'service'), async (req, res) => {
  const parsed = vehicleUpdateSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(422).json(apiError('VALIDATION_FAILED', 'Invalid vehicle payload', parsed.error.issues));
  }

  const result = await updateVehicle(req.params.id, parsed.data);

  if (result.status === 'not_found') {
    return res.status(404).json(apiError('NOT_FOUND', 'Vehicle not found'));
  }

  if (result.status === 'conflict') {
    return res.status(409).json(apiError('CONFLICT', 'Stale rev, vehicle was modified', { current: result.vehicle }));
  }

  return res.status(200).json({ vehicle: result.vehicle });
});

router.delete('/:id', authenticate, allowActor('admin', 'service'), async (req, res) => {
  const vehicle = await deleteVehicle(req.params.id);

  if (!vehicle) {
    return res.status(404).json(apiError('NOT_FOUND', 'Vehicle not found'));
  }

  return res.status(200).json({ vehicle });
});

export default router;
