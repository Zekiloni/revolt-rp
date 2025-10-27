import { Types } from 'mongoose';
import { ICriminalRecordCreate } from '@revolt-rp/common';
import { isLawOrganization } from '../../organization.service';
import { Character, CriminalRecordModel } from '@revolt-rp/core';

export const createCriminalRecord = async (
  criminalRecord: ICriminalRecordCreate,
  officer: Character
) => {
  const isOfficer = await isLawOrganization(
    (<Types.ObjectId>officer.membership.organization).toString()
  );
  if (!isOfficer) throw new Error('not_officer');
  return CriminalRecordModel.create({
    ...criminalRecord,
    target: criminalRecord.targetCharacterId,
    officer,
  });
};

export async function getAllCriminalRecords() {
  return CriminalRecordModel.find().populate(['target', 'officer']);
}
