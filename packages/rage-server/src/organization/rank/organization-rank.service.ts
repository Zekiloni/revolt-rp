import { OrganizationRankModel } from './organization-rank.model';


export const getRankById = async (id: string) => {
  return OrganizationRankModel.findById(id);
}
