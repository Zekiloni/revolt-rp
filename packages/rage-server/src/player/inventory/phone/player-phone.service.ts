import { t } from 'i18next';
import { Types } from 'mongoose';
import { customAlphabet } from 'nanoid';
import { triggerBrowsers } from '@libertymp/rage-rpc';
import {
  ACTIVA_CALL_STATUS, hexColors,
  IPhoneContact,
  IPhoneContactCreate,
  IPhoneInfo, IPhoneMessage,
  IPhoneMessageCreate,
  IPhoneSettingsUpdate, PhoneCallStatus, PlayerPhoneState, PlayerSharedDataType,
  ProcedureKey
} from '@revolt-rp/common';
import { SmartphoneItemModel } from '../../../item/registry/electronic/smartphone-item.model';
import { notifyPlayer } from '../../util/player-notify.util';
import { Item, ItemModel } from '../../../item/item.model';
import { PhoneMessageModel } from './phone-message.model';
import { PhoneCall, PhoneCallModel } from './phone-call.model';


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

export const createPhoneCall = async (caller: string, receiver: string) => {
  return PhoneCallModel.create({
    caller, receiver
  });
};

export const getPhoneItemByContactId = async (contactId: string) => {
  return ItemModel.findOne({
    'phoneInfo.contacts': { $elemMatch: { id: contactId } }
  }).exec();
};


export const getActivePhoneCallByPhoneNumber = async (phoneNumber: string | string[]) => {
  return PhoneCallModel.findOne({
    $or: [
      { caller: Array.isArray(phoneNumber) ? { $in: phoneNumber } : phoneNumber },
      { receiver: Array.isArray(phoneNumber) ? { $in: phoneNumber } : phoneNumber }
    ],
    status: { $in: ACTIVA_CALL_STATUS }
  });
};

export const getPlayerPhoneByPhoneNumber = (player: PlayerMp, phoneNumber: string | string[]) => {
  const phoneNumbers = Array.isArray(phoneNumber) ? phoneNumber : [phoneNumber];
  return player.character.inventory.find((item: Item) => phoneNumbers.includes(item.phoneInfo.phoneNumber));
};

export const getPhoneCallById = async (callId: string) => {
  return PhoneCallModel.findById(callId);
};

const createPhoneMessage = async (messageCreate: IPhoneMessageCreate) => {
  return PhoneMessageModel.create({
    ...messageCreate,
    seen: false,
    createdAt: new Date()
  });
};


export const updatePhoneMessage = async (message: IPhoneMessage) => {
  return PhoneMessageModel.updateOne({ id: message.id }, message).exec();
};

export const updateManyPhoneMessages = async (messages: IPhoneMessage[]) => {
  console.log('messages to update ', messages);

  try {
    await PhoneMessageModel.bulkWrite(messages.map((message: IPhoneMessage) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, id, ...updateData } = message;
      return {
        updateOne: {
          filter: { _id: message._id },
          update: { $set: updateData }
        }
      };
    }));
  } catch (e) {
    console.log('error', e);
  }

  return messages;
};

export const createPhoneContact = async (item: Item, contactCreate: IPhoneContactCreate) => {
  const contact: IPhoneContact = {
    id: new Types.ObjectId().toHexString(),
    name: contactCreate.name,
    phoneNumber: contactCreate.phoneNumber,
    favorite: contactCreate.favorite,
    emailAddress: contactCreate.emailAddress
  };

  item.phoneInfo.contacts.push(contact);

  item.markModified('phoneInfo.contacts');
  await item.save();

  return contact;
};

export const updatePhoneContact = async (item: Item, contactUpdate: IPhoneContact) => {
  const phoneInfo = item.phoneInfo;

  phoneInfo.contacts = item.phoneInfo.contacts
    .map((contact: IPhoneContact) => contactUpdate.id === contact.id ? contactUpdate : contact);

  item.phoneInfo = phoneInfo;

  item.markModified('phoneInfo.contacts');
  await item.save();

  return contactUpdate;
};

export const deletePhoneContact = async (item: Item, contactId: string) => {
  item.phoneInfo.contacts = item.phoneInfo.contacts
    .filter((contact: IPhoneContact) => contact.id !== contactId);

  item.markModified('phoneInfo.contacts');
  await item.save();

  return contactId;
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

export const playerCallPhone = async (player: PlayerMp, item: Item, targetPhoneNumber: string) => {
  const phoneCall = await createPhoneCall(item.phoneInfo.phoneNumber, targetPhoneNumber);
  const target = getPlayerByPhoneNumber(targetPhoneNumber);

  player.setVariable(PlayerSharedDataType.PhoneState, PlayerPhoneState.InCall);
  if (target) {
    triggerBrowsers(target, ProcedureKey.BROWSER_SET_PHONE_CALL, phoneCall);
  } else {
    notifyPlayer(player, { severity: 'error', detail: t('phone_number_not_found') });
    phoneCall.status = PhoneCallStatus.Rejected;
  }
};

export const playerAnswerPhoneCall = async (player: PlayerMp, callId: string) => {
  const phoneCall = await getPhoneCallById(callId);

  if (!phoneCall) return;
  if (phoneCall.status !== PhoneCallStatus.Dialing) return;

  const playerPhoneNumbers = getPlayerPhoneNumbers(player);
  const isCaller = playerPhoneNumbers.includes(phoneCall.caller);

  phoneCall.status = PhoneCallStatus.Ongoing;

  await phoneCall.save();

  const targetPhoneNumber = isCaller ? phoneCall.receiver : phoneCall.caller;
  const target = getPlayerByPhoneNumber(targetPhoneNumber);

  triggerBrowsers(player, ProcedureKey.BROWSER_SET_PHONE_CALL, phoneCall);

  if (target && mp.players.exists(target)) {
    target.setVariable(PlayerSharedDataType.PhoneState, PlayerPhoneState.InCall);
    triggerBrowsers(target, ProcedureKey.BROWSER_SET_PHONE_CALL, phoneCall);
  }
};

export const playerHangupPhoneCall = async (player: PlayerMp, callId: string) => {
  const phoneCall = await getPhoneCallById(callId);

  if (!phoneCall || !ACTIVA_CALL_STATUS.includes(phoneCall.status)) return;

  const playerPhoneNumbers = getPlayerPhoneNumbers(player);
  const isCaller = playerPhoneNumbers.includes(phoneCall.caller);

  phoneCall.status = phoneCall.status === PhoneCallStatus.Dialing
    ? PhoneCallStatus.Rejected
    : PhoneCallStatus.Ended;

  await phoneCall.save();

  const targetPhoneNumber = isCaller ? phoneCall.receiver : phoneCall.caller;
  const target = getPlayerByPhoneNumber(targetPhoneNumber);

  triggerBrowsers(player, ProcedureKey.BROWSER_SET_PHONE_CALL, phoneCall);
  player.outputChatBox(`!{${hexColors.GARGOYLE_GAS}}${t('phone')} ${targetPhoneNumber} ${t('phone_call_hangup')}`);
  player.setVariable(PlayerSharedDataType.PhoneState, PlayerPhoneState.Idle);

  if (target && mp.players.exists(target)) {
    target.setVariable(PlayerSharedDataType.PhoneState, PlayerPhoneState.Idle);
    target.outputChatBox(`!{${hexColors.GARGOYLE_GAS}}${t('phone')} ${isCaller ? phoneCall.caller : phoneCall.receiver} ${t('phone_call_hangup')}`);
    triggerBrowsers(target, ProcedureKey.BROWSER_SET_PHONE_CALL, phoneCall);
  }
};

export const playerSpeakPhoneCall = async (player: PlayerMp, playerPhoneNumbers: string[], phoneCall: PhoneCall, content: string) => {
  const isCaller = playerPhoneNumbers.includes(phoneCall.caller);

  const targetPhoneNumber = isCaller ? phoneCall.receiver : phoneCall.caller;

  const target = getPlayerByPhoneNumber(targetPhoneNumber);

  player.outputChatBox(`!{${hexColors.GARGOYLE_GAS}}${t('phone')} ${targetPhoneNumber}: ${content}`);
  if (target && mp.players.exists(target)) {
    target.outputChatBox(`!{${hexColors.GARGOYLE_GAS}}${t('phone')} ${isCaller ? phoneCall.caller : phoneCall.receiver}: ${content}`);
  }
};
