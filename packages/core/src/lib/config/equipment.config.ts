import { IEquipment, JobKey, OrganizationType } from '@revolt-rp/common';
import { getBaseItem } from '../service/item-registry.service';

export type OrganizationEquipmentConfig = {
  [name in OrganizationType | JobKey]: IEquipment[];
};

export const equipmentConfig: Partial<OrganizationEquipmentConfig> = {
  [OrganizationType.LAW]: [{ item: 'items.cuffs', data: getBaseItem('items.cuffs'), limit: 5 }],
  [OrganizationType.EMS]: [{ item: '', limit: 20 }]
};
