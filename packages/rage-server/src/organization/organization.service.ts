import { Organization, OrganizationModel } from './organization.model';
import { t } from 'i18next';

export const isOrganizationNameAvailable = async (name: string, shortName: string) => {
  return OrganizationModel.findOne({
    $or: [
      { name }, { shortName }
    ]
  }).exec();
}

export const getAllOrganizations = () => {
  return OrganizationModel.find()
    .populate('parentOrganization')
    .exec();
}

export const createOrganization = async (organization: Partial<Organization>) => {
  const alreadyExist = await isOrganizationNameAvailable(organization.name, organization.shortName);

  if (alreadyExist) {
    throw new Error(t('organization_name_taken'));
  }

  return await OrganizationModel.create(organization);
};
