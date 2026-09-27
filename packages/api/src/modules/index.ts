import { Router } from 'express';
import statusController from './status/status.controller';
import authorizationController from './authorization/authorization.controller';
import accountController from './account/account.controller';
import characterController from './character/character.controller';
import whitelistController from './whitelist/whitelist.controller';
import vehicleController from './vehicle/vehicle.controller';
import propertyController from './property/property.controller';
import imageController from './image/image.controller';
import audioStreamController from './audio-stream/audio-stream.controller';

const router = Router();

router.use('/status', statusController);
router.use('/auth', authorizationController);
router.use('/account', accountController);
router.use('/whitelist', whitelistController);
router.use('/character', characterController);
router.use('/vehicle', vehicleController);
router.use('/property', propertyController);
router.use('/image', imageController);
router.use('/audio-stream', audioStreamController);

export default router;
