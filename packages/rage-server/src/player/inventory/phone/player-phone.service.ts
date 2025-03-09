import { Item } from '../../../item/item.model';
import { SmartphoneItemModel } from '../../../item/registry/electronic/smartphone-item.model';
import { IPhoneInfo, ProcedureKey } from '@revolt-rp/common';
import { customAlphabet } from 'nanoid';
import { PhoneMessageModel } from './phone-message.model';
import { triggerBrowsers } from '@libertymp/rage-rpc';


const DEFAULT_PHONE_INFO: IPhoneInfo = {
  backgroundImage: 'assets/images/phone/backgrounds/1.jpg',
  contacts: [],
  notes: [],
  opacity: 1.0,
  phoneNumber: '',
  power: true
};


export const generatePhoneNumber = () => {
  const generate = customAlphabet('0123456789', 7);
  return generate();
};


export const getPlayerPhoneNumbers = (player: PlayerMp) => {
  return player.character.inventory.filter((item: Item) => {

    if (item.phoneInfo && item.phoneInfo.phoneNumber) {
      return item.phoneInfo.phoneNumber;
    }
  });
};


export const getPhoneMessages = async (phoneNumber: string) => {
  return PhoneMessageModel.find({
    $or: [
      { receiver: phoneNumber },
      { sender: phoneNumber }
    ]
  }).sort({ createdAt: -1 }).exec();
};


export const playerTogglePhone = async (player: PlayerMp, phone: Item, toggle: boolean) => {
  const itemHandler = phone.data;

  if (itemHandler && itemHandler instanceof SmartphoneItemModel) {
    if (!phone.phoneInfo) {
      phone.phoneInfo = DEFAULT_PHONE_INFO;
      phone.phoneInfo.phoneNumber = generatePhoneNumber();
      await phone.save();
    }

    if (toggle) {
      const messages = await getPhoneMessages(phone.phoneInfo.phoneNumber);

      triggerBrowsers(player, ProcedureKey.BROWSER_SET_PHONE, phone);
      triggerBrowsers(player, ProcedureKey.BROWSER_SET_PHONE_MESSAGES, messages);

      itemHandler.use(player, phone);
    } else {
      itemHandler.putAway(player, phone);
    }
  }
};
