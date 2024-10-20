import { Ref } from '@typegoose/typegoose';
import { Vector3 } from '../core.interface';
import { OrganizationType } from './oranization.enum';

export const enum OrganizationPermissionType {
  NONE,
  MANAGE_MEMBERS,
  MANAGE_ORGANIZATION
}

export interface IOrganizationRank {
  id?: string;
  name: string;
  salary: number;
  permission: OrganizationPermissionType;
}

export interface IOrganization {
  id?: string;
  name: string;
  shortName: string;
  type: OrganizationType;
  parentOrganization?: Ref<IOrganization>;
  position: Vector3;
  ranks: Ref<IOrganizationRank>[];
  heading: number;
  dimension: number;
  color?: string;
  importLimit?: number;
  createdAt: Date;
  updatedAt?: Date;
}
