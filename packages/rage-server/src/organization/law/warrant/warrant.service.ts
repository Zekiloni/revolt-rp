import { Types } from 'mongoose';
import { IWarrantCreate } from '@revolt-rp/common';
import { WarrantModel } from './warrant.model';
import { isLawOrganization } from '../../organization.service';
import { Character } from '../../../player/character/character.model';

export const createWarrant = async (
  warrant: IWarrantCreate,
  issuedBy: Character
) => {
  const isOfficer = await isLawOrganization(
    (<Types.ObjectId>issuedBy.membership.organization).toString()
  );
  if (!isOfficer) throw new Error('not_officer');

  return WarrantModel.create({
    ...warrant,
    target: warrant.targetCharacterId,
    issuedBy,
    warrant,
  });
};

export function getAllWarrants() {
  return WarrantModel.find().populate(['target', 'issuedBy']);
}
