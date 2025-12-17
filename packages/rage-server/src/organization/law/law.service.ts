import { getPhoneByPhoneNumber, getPlayerByPhoneNumber } from '../../player/inventory/phone/player-phone.service';

export const trackPhoneNumber = async (phoneNumb: string) => {
  const target = getPlayerByPhoneNumber(phoneNumb);
  const phone = await getPhoneByPhoneNumber(phoneNumb);
  return target.position || phone.position || null;
};
