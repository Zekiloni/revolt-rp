import { Types } from 'mongoose';
import { IGangRecordCreate } from '@revolt-rp/common';
import { Character } from '../../../player/character/character.model';
import { isLawOrganization } from '../../organization.service';
import { GangRecordModel } from './gang-record.model';

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
