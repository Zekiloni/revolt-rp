import { Router } from 'express';
import statusController from './status.controller';
import authorizationController from './authorization.controller';

const router = Router();

router.use('/status', statusController);
router.use('/auth', authorizationController)

export default router;
