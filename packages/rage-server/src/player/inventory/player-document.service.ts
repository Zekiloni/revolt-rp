import { DrivingLicenseCategory, IDocumentInfo } from '@revolt-rp/common';
import { playerGiveItem } from './player-inventory.service';
import dayjs from 'dayjs';
import { dmvConfig } from '../../property/public-service/dmv.config';


export const playerCreateDrivingLicense = async (player: PlayerMp, category: DrivingLicenseCategory) => {
  const documentInfo: IDocumentInfo = {
    name: player.character.fullName,
    birthday: player.character.birthday,
    origin: player.character.origin,
    category
  };

  await playerGiveItem(player, 'items.driving_license', 1, {
    expiringAt: dayjs().add(dmvConfig.drivingLicenseExpireDays, 'days').toDate(),
    documentInfo
  });
};
