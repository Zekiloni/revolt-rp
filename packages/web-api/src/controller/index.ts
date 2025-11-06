import { Router } from 'express';
import statusController from './status.controller';
import authorizationController from './authorization.controller';
import accountController from './account.controller';
import characterController from './character.controller';
import whitelistController from './whitelist.controller';
import vehicleController from './vehicle.controller'
import propertyController from './property.controller'

const router = Router();

router.use('/status', statusController);
router.use('/auth', authorizationController);
router.use('/account', accountController);
router.use('/whitelist', whitelistController);
router.use('/character', characterController);
router.use('/vehicle', vehicleController);
router.use('/property', propertyController)

export default router;
