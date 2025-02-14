import { Ref } from '@typegoose/typegoose';
import { Vector3 } from '../core.interface';
import { OrganizationType } from './oranization.enum';
import { Base } from '@typegoose/typegoose/lib/defaultClasses';

export enum OrganizationPermissionType {
  NONE,
  MANAGE_MEMBERS,
  MANAGE_ORGANIZATION
}

export interface IOrganizationRank extends Base {
  name: string;
  salary: number;
  permission: OrganizationPermissionType;
}

export interface IOrganization extends Base {
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
