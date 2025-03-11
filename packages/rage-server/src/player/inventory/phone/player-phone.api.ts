import { on, ProcedureListenerInfo, register } from '@libertymp/rage-rpc';
import {
  IPhoneContact,
  IPhoneContactCreate, IPhoneMessage,
  IPhoneMessageCreate,
  IPhoneSettingsUpdate,
  ProcedureKey
} from '@revolt-rp/common';
import {
  createPhoneContact, deletePhoneContact, playerSendPhoneMessage,
  playerTogglePhone, updatePhoneContact, updatePhoneMessage,
  updatePhoneSettings
} from './player-phone.service';
import { getPlayerSelectedItem } from '../player-inventory.service';
import { getItemById } from '../../../item/item.service';


async function playerTogglePhoneHandler(toggle: boolean, { player }: ProcedureListenerInfo<PlayerMp>) {
  const phoneItem = getPlayerSelectedItem(player);

  if (!phoneItem) {
    return;
  }

  await playerTogglePhone(player, phoneItem, toggle);
}


async function sendPhoneMessageHandler(messageCreate: IPhoneMessageCreate, { player }: ProcedureListenerInfo<PlayerMp>) {
  await playerSendPhoneMessage(player, messageCreate);
}

async function playerUpdatePhoneSettings(settings: IPhoneSettingsUpdate) {
  const item = await getItemById(settings.itemId);

  if (!item) {
    return;
  }

  return updatePhoneSettings(item, settings);
}

async function playerCreatePhoneContactHandler(contactCreate: IPhoneContactCreate, { player }: ProcedureListenerInfo<PlayerMp>) {
  return createPhoneContact(getPlayerSelectedItem(player), contactCreate);

}

async function playerUpdatePhoneContactHandler(phoneContactUpdate: IPhoneContact, { player }: ProcedureListenerInfo<PlayerMp>) {
  return updatePhoneContact(getPlayerSelectedItem(player), phoneContactUpdate);
}

async function playerDeletePhoneContactHandler(contact: IPhoneContact, { player }: ProcedureListenerInfo<PlayerMp>) {
  return deletePhoneContact(getPlayerSelectedItem(player), contact.id);
}

function playerUpdatePhoneMessageHandler(message: IPhoneMessage) {
  return updatePhoneMessage(message);
}

on(ProcedureKey.SERVER_TOGGLE_PHONE, playerTogglePhoneHandler);
on(ProcedureKey.SERVER_SEND_PHONE_MESSAGE, sendPhoneMessageHandler);
register(ProcedureKey.SERVER_UPDATE_PHONE_SETTINGS, playerUpdatePhoneSettings);
register(ProcedureKey.SERVER_CREATE_PHONE_CONTACT, playerCreatePhoneContactHandler);
register(ProcedureKey.SERVER_UPDATE_PHONE_CONTACT, playerUpdatePhoneContactHandler);
register(ProcedureKey.SERVER_DELETE_PHONE_CONTACT, playerDeletePhoneContactHandler);
register(ProcedureKey.SERVER_UPDATE_PHONE_MESSAGE, playerUpdatePhoneMessageHandler);
