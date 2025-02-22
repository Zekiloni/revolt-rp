import { OrganizationRankModel } from './organization-rank.model';
import { OrganizationPermissionType } from '@revolt-rp/common';


export const getOrganizationRankById = async (id: string) => {
  return OrganizationRankModel.findById(id);
};

export const createOrganizationRank = (name: string, permission: OrganizationPermissionType, salary: number) => {
  return OrganizationRankModel.create({
    name, permission, salary
  });
};


export const deleteOrganizationRankById = (rankId: string) => {
  return OrganizationRankModel.findByIdAndDelete(rankId);
};
