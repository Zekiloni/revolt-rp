import { customAlphabet } from 'nanoid';
import { triggerBrowsers } from '@libertymp/rage-rpc';
import { IPhoneContact, IPhoneInfo, IPhoneMessageCreate, IPhoneSettingsUpdate, ProcedureKey } from '@revolt-rp/common';
import { SmartphoneItemModel } from '../../../item/registry/electronic/smartphone-item.model';
import { PhoneMessageModel } from './phone-message.model';
import { Item, ItemModel } from '../../../item/item.model';
import { t } from 'i18next';
import { notifyPlayer } from '../../util/player-notify.util';


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


const createPhoneMessage = async (messageCreate: IPhoneMessageCreate) => {
  return PhoneMessageModel.create({
    ...messageCreate,
    seen: false,
    createdAt: new Date()
  });
};

export const createPhoneContact = async (phone: Item, contact: IPhoneContact) => {
  phone.phoneInfo.contacts.push(contact);
  return phone.save();
};

export const updatePhoneContact = async (phone: Item, contactUpdate: IPhoneContact) => {
  phone.phoneInfo.contacts = phone.phoneInfo.contacts
    .map((contact: IPhoneContact) => contactUpdate.phoneNumber === contact.phoneNumber ? contactUpdate : contact);

  await phone.save();
  return contactUpdate;
};

export const deletePhoneContact = async (phone: Item, phoneNumber: string) => {
  phone.phoneInfo.contacts = phone.phoneInfo.contacts
    .filter((contact: IPhoneContact) => contact.phoneNumber !== phoneNumber);

  await phone.save();
  return true;
};

export const updatePhoneSettings = async (phone: Item, settings: IPhoneSettingsUpdate) => {
  delete settings.itemId;

  phone.phoneInfo = {
    ...phone.phoneInfo,
    ...settings
  };

  return phone.save();
};


export const getPlayerPhoneNumbers = (player: PlayerMp) => {
  return player.character.inventory.map((item: Item) => {
    if (item.phoneInfo && item.phoneInfo.phoneNumber) {
      return item.phoneInfo.phoneNumber;
    }
  });
};

export const getPhoneByPhoneNumber = async (phoneNumber: string) => {
  return ItemModel.findOne({ 'phoneInfo.phoneNumber': phoneNumber }).exec();
};

export const getPlayerByPhoneNumber = (phoneNumber: string) => {
  return mp.players.toArray()
    .find((player: PlayerMp) => getPlayerPhoneNumbers(player).includes(phoneNumber));
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


export const playerSendPhoneMessage = async (player: PlayerMp, messageCreate: IPhoneMessageCreate) => {
  const isValidPhoneNumber = !!(await getPhoneByPhoneNumber(messageCreate.receiver));

  if (!isValidPhoneNumber) {
    return notifyPlayer(player, { severity: 'error', detail: t('invalid_phone_number') });
  }

  const message = await createPhoneMessage(messageCreate);

  const target = getPlayerByPhoneNumber(messageCreate.receiver);

  if (target) {
    triggerBrowsers(target, ProcedureKey.BROWSER_ADD_PHONE_MESSAGE, message);
  }

  triggerBrowsers(player, ProcedureKey.BROWSER_ADD_PHONE_MESSAGE, message);
};

