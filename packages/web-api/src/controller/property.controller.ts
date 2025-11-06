import { Router } from 'express';
import { getAllProperties } from '../service/property.service';

const router = Router();

router.get('', async  (req, res) => {
  const { limit = 50, offset = 0, ...filter } = req.query;

  const [properties, total] = await getAllProperties(
    filter,
    Number(limit),
    Number(offset)
  );

  return res.status(200).json({ properties, total });
});


export default router;
