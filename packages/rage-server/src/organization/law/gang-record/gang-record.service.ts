import { Types } from 'mongoose';
import { IGangRecord, IGangRecordCreate } from '@revolt-rp/common';
import { isLawOrganization } from '../../organization.service';
import { Character, GangRecordModel } from '@revolt-rp/core';


export const createGangRecord = async (
  gangRecord: IGangRecordCreate,
  officer: Character
) => {
  const isOfficer = await isLawOrganization(
    (<Types.ObjectId>officer.membership.organization).toString()
  );

  if (!isOfficer) throw new Error('not_officer');

  return GangRecordModel.create({ ...gangRecord, officer });
};

export function getAllGangRecords() {
  return GangRecordModel.find()
    .populate('officer')
    .sort({ createdAt: -1 });
}


export function deleteGangRecord(id: string, officer: Character) {
  const isOfficer = isLawOrganization(
    (<Types.ObjectId>officer.membership.organization).toString()
  );

  if (!isOfficer) throw new Error('not_officer');

  return GangRecordModel.findByIdAndDelete(id);
}


export function updateGangRecord(
  gangRecord: IGangRecord,
  officer: Character
) {
  const isOfficer = isLawOrganization(
    (<Types.ObjectId>officer.membership.organization).toString()
  );

  if (!isOfficer) throw new Error('not_officer');

  return GangRecordModel.findByIdAndUpdate(gangRecord.id, {
    name: gangRecord.name,
    description: gangRecord.description,
    location: gangRecord.location,
    note: gangRecord.note
  }, { new: true });
}
