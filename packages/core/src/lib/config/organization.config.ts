import { OrganizationType } from '@revolt-rp/common';

type OrganizationEquipmentConfig = {
  [name in OrganizationType]: {
    item: string;
    quantity?: number;
    limit: number;
    price?: number;
  }[];
};

export const ORGANIZATION_CONFIG: { equipment: Partial<OrganizationEquipmentConfig> } = {
  equipment: {
    [OrganizationType.LAW]: [{ item: '', limit: 20 }],
    [OrganizationType.EMS]: [{ item: '', limit: 20 }]
  }
};
