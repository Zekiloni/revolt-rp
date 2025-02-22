import { Router } from 'express';
import statusController from './status.controller';

const router = Router();

router.use('/status', statusController);

export default router;
