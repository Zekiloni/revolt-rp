import { Ref } from '@typegoose/typegoose';
import { Base } from '@typegoose/typegoose/lib/defaultClasses';
import { OrganizationType } from './oranization.enum';
import { IVector3 } from '../core.interface';

export enum OrganizationPermissionType {
  NORMAL = 'normal_member',
  MANAGE_MEMBERS = 'manage_members',
  MANAGE_ORGANIZATION = 'manage_organization',
}


export interface IOrganizationMemberInvite {
  playerId: number;
  rankId: string;
}

export interface IOrganizationRankCreate {
  organizationId: string;
  name: string;
  permission: OrganizationPermissionType;
  salary: number;
}

export interface IOrganizationRank extends Base {
  name: string;
  salary: number;
  permission: OrganizationPermissionType;
}

export interface IOrganizationRankUpdate {
  id: string;
  name: string;
  salary: number;
  permission: OrganizationPermissionType;
}

export interface IOrganization extends Base {
  name: string;
  shortName: string;
  type: OrganizationType;
  parentOrganization?: Ref<IOrganization>;
  position: IVector3;
  ranks: Ref<IOrganizationRank>[];
  heading: number;
  dimension: number;
  balance: number;
  color?: string;
  importLimit?: number;
  createdAt: Date;
  updatedAt?: Date;
}
