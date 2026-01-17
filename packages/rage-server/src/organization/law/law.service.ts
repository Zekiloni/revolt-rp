import { t } from 'i18next';
import { getPhoneByPhoneNumber, getPlayerByPhoneNumber } from '../../player/inventory/phone/player-phone.service';

export const trackPhoneNumber = async (phoneNumb: string) => {
  const [target, phone] = await Promise.all([
    getPlayerByPhoneNumber(phoneNumb),
    getPhoneByPhoneNumber(phoneNumb)
  ]);

  if (!target && !phone) {
    throw new Error(t('phone_not_found'));
  }

  if (phone?.phoneInfo.power === false) {
    throw new Error(t('phone_powered_off'));
  }

  return target?.position ?? phone?.position;
};

