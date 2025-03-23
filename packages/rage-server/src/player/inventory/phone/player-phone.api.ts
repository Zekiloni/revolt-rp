import { on, ProcedureListenerInfo, register } from '@libertymp/rage-rpc';
import {
  IPhoneContact,
  IPhoneContactCreate, IPhoneMessage,
  IPhoneMessageCreate, IPhonePhoto,
  IPhoneSettingsUpdate,
  ProcedureKey
} from '@revolt-rp/common';
import {
  addPhonePhoto,
  createPhoneContact,
  deletePhoneContact, deletePhonePhoto,
  playerAnswerPhoneCall,
  playerCallPhone,
  playerHangupPhoneCall,
  playerSendPhoneMessage,
  playerTogglePhone,
  updateManyPhoneMessages,
  updatePhoneContact,
  updatePhoneMessage, updatePhoneNotes,
  updatePhoneSettings
} from './player-phone.service';
import { getPlayerSelectedItem } from '../player-inventory.service';
import { getBankAccountByPhoneNumber } from '../../../banking/banking.service';


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


async function playerCreatePhoneContactHandler(contactCreate: IPhoneContactCreate, { player }: ProcedureListenerInfo<PlayerMp>) {
  const playerSelectedItem = getPlayerSelectedItem(player);
  return createPhoneContact(playerSelectedItem, contactCreate);

}

async function playerUpdatePhoneContactHandler(phoneContactUpdate: IPhoneContact, { player }: ProcedureListenerInfo<PlayerMp>) {
  return updatePhoneContact(getPlayerSelectedItem(player), phoneContactUpdate);
}

async function playerDeletePhoneContactHandler(contact: IPhoneContact, { player }: ServerProcedureListenerInfo) {
  return deletePhoneContact(getPlayerSelectedItem(player), contact.id);
}

function playerUpdatePhoneMessageHandler(message: IPhoneMessage) {
  return updatePhoneMessage(message);
}

function playerUpdateManyPhoneMessagesHandler(messages: IPhoneMessage[]) {
  return updateManyPhoneMessages(messages);
}

async function createPhoneCallHandler(phoneNumber: string, { player }: ServerProcedureListenerInfo) {
  await playerCallPhone(player, getPlayerSelectedItem(player), phoneNumber);
}

async function hangupPhoneCallHandler(callId: string, { player }: ProcedureListenerInfo<PlayerMp>) {
  await playerHangupPhoneCall(player, callId);
}

async function answerPhoneCallHandler(callId: string, { player }: ProcedureListenerInfo<PlayerMp>) {
  await playerAnswerPhoneCall(player, callId);
}

function updatePhoneNotesHandler(notes: string[], { player }: ProcedureListenerInfo<PlayerMp>) {
  const item = getPlayerSelectedItem(player);
  return updatePhoneNotes(item, notes);
}

function playerUpdatePhoneSettingsHandler(settings: IPhoneSettingsUpdate, { player }: ProcedureListenerInfo<PlayerMp>) {
  const item = getPlayerSelectedItem(player);
  return updatePhoneSettings(item, settings);
}

function getBankAccountByPhoneNumberHandler(phoneNumber: string) {
  return getBankAccountByPhoneNumber(phoneNumber);
}

function addPhonePhotoHandler(photo: IPhonePhoto, { player }: ProcedureListenerInfo<PlayerMp>) {
  const item = getPlayerSelectedItem(player);
  return addPhonePhoto(item, photo);
}

function deletePhonePhotoHandler(photoId: string, { player }: ProcedureListenerInfo<PlayerMp>) {
  const item = getPlayerSelectedItem(player);
  return deletePhonePhoto(item, photoId);
}

on(ProcedureKey.SERVER_TOGGLE_PHONE, playerTogglePhoneHandler);
on(ProcedureKey.SERVER_SEND_PHONE_MESSAGE, sendPhoneMessageHandler);
on(ProcedureKey.SERVER_CREATE_PHONE_CALL, createPhoneCallHandler);
on(ProcedureKey.SERVER_HANGUP_PHONE_CALL, hangupPhoneCallHandler);
on(ProcedureKey.SERVER_ANSWER_PHONE_CALL, answerPhoneCallHandler);
register(ProcedureKey.SERVER_UPDATE_PHONE_SETTINGS, playerUpdatePhoneSettingsHandler);
register(ProcedureKey.SERVER_CREATE_PHONE_CONTACT, playerCreatePhoneContactHandler);
register(ProcedureKey.SERVER_UPDATE_PHONE_CONTACT, playerUpdatePhoneContactHandler);
register(ProcedureKey.SERVER_DELETE_PHONE_CONTACT, playerDeletePhoneContactHandler);
register(ProcedureKey.SERVER_UPDATE_PHONE_MESSAGE, playerUpdatePhoneMessageHandler);
register(ProcedureKey.SERVER_UPDATE_PHONE_MESSAGES, playerUpdateManyPhoneMessagesHandler);
register(ProcedureKey.SERVER_PHONE_UPDATE_NOTES, updatePhoneNotesHandler);
register(ProcedureKey.SERVER_GET_BANK_ACCOUNT_BY_PHONE_NUMBER, getBankAccountByPhoneNumberHandler);
register(ProcedureKey.SERVER_PHONE_ADD_PHOTO, addPhonePhotoHandler)
register(ProcedureKey.SERVER_PHONE_DELETE_PHOTO, deletePhonePhotoHandler)
