import { ISobrietyTestCreate } from '@revolt-rp/common';
import { isLawOrganization } from '../../organization.service';
import { Types } from 'mongoose';
import { Character, SobrietyTestModel } from '@revolt-rp/core';

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
