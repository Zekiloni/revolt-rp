import { Router } from 'express';
import { getAllVehicles } from '../service/vehicle.service';

const router = Router();

router.get('', async  (req, res) => {
  const { limit = 50, offset = 0, ...filter } = req.query;

  const [vehicles, total] = await getAllVehicles(
    filter,
    Number(limit),
    Number(offset)
  );

  return res.status(200).json({ vehicles, total });
});


export default router;
