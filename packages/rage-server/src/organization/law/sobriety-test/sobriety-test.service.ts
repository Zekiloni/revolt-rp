import { ISobrietyTestCreate } from '@revolt-rp/common';
import { Character } from '../../../player/character/character.model';
import { isLawOrganization } from '../../organization.service';
import { Types } from 'mongoose';
import { SobrietyTestModel } from './sobriety-test.model';

export const createSobrietyTest = async (
  sobrietyTest: ISobrietyTestCreate,
  testedBy: Character
) => {
  const isOfficer = await isLawOrganization(
    (<Types.ObjectId>testedBy.membership.organization).toString()
  );
  if (!isOfficer) throw new Error('not_officer');

  return SobrietyTestModel.create({
    ...sobrietyTest,
    target: sobrietyTest.targetCharacterId,
    testedBy,
  });
};
export function getAllSobrietyTests() {
  return SobrietyTestModel.find()
    .populate(['target', 'testedBy']);
}
