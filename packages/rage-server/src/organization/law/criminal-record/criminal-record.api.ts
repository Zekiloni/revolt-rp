import {
  createCriminalRecord,
  getAllCriminalRecords,
} from './criminal-record.service';
import { ICriminalRecordCreate, ProcedureKey } from '@revolt-rp/common';
import { ProcedureListenerInfo, register } from '@libertymp/rage-rpc';

async function createCriminalRecordHandler(
  criminalRecord: ICriminalRecordCreate,
  { player }: ProcedureListenerInfo<PlayerMp>
) {
  return createCriminalRecord(criminalRecord, player.character);
}

async function getAllCriminalRecordsHandler() {
  return getAllCriminalRecords();
}

register(
  ProcedureKey.SERVER_CREATE_CRIMINAL_RECORD,
  createCriminalRecordHandler
);
register(ProcedureKey.SERVER_GET_CRIMINAL_RECORD, getAllCriminalRecordsHandler);
