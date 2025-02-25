import { t } from 'i18next';
import { on, ProcedureListenerInfo, register } from '@libertymp/rage-rpc';
import {
  catchError,
  GameUiKey,
  IMemberUpdate,
  IOrganizationMemberInvite,
  IOrganizationRankCreate,
  ProcedureKey
} from '@revolt-rp/common';
import {
  createOrganization,
  getAllOrganizations, getOrganizationById,
  getOrganizationMembers, invitePlayerToOrganization, playerCreateOrganizationRank, playerDeleteOrganizationRank,
  playerUpdateOrganizationMember, removePlayerFromOrganizationByCharacterId
} from './organization.service';
import { hidePlayerGameInterface, notifyPlayer } from '../player/util/player-notify.util';
import { Organization } from './organization.model';


function getOrganizationsHandler() {
  return getAllOrganizations();
}

const getOrganizationHandler = (organizationId: string) => {
  return getOrganizationById(organizationId)
    .populate('parentOrganization')
    .populate('ranks')
    .exec();
};

function getOrganizationMembersHandler(organizationId: string) {
  return getOrganizationMembers(organizationId);
}

export const createOrganizationHandler = (organizationCreate: Partial<Organization>, { player }: ProcedureListenerInfo<PlayerMp>) => {
  createOrganization({
    ...organizationCreate,
    position: player.position,
    dimension: player.dimension,
    heading: player.heading
  }).then((organization) => {
    notifyPlayer(player, {
      severity: 'success',
      summary: t('success'),
      detail: t('organization_created', { name: organization.name })
    });
    hidePlayerGameInterface(player, GameUiKey.CreateOrganization);
  }).catch((error) => {
    const apiError = catchError(error);
    notifyPlayer(player, {
      severity: 'error',
      summary: t('bad_request'),
      detail: t(apiError.message)
    });
  });
};

async function playerUpdateOrganizationMemberHandler(memberUpdate: IMemberUpdate, { player }: ProcedureListenerInfo<PlayerMp>) {
  return await playerUpdateOrganizationMember(player, memberUpdate)
    .then(character => character)
    .catch((error) => catchError(error));
}

const playerInvitePlayerToOrganizationHandler = async (memberInvite: IOrganizationMemberInvite, { player }: ProcedureListenerInfo<PlayerMp>) => {
  const target = mp.players.at(memberInvite.playerId);

  if (!target || !target.character)
    return notifyPlayer(player, { severity: 'error', summary: t('not_found'), detail: t('player_target_not_found') });

  await invitePlayerToOrganization(player, target, memberInvite.rankId);
};

async function playerUninviteMemberHandler(characterId: string, { player }: ProcedureListenerInfo<PlayerMp>) {
  return removePlayerFromOrganizationByCharacterId(player, characterId)
    .then(() => true)
    .catch((error) => notifyPlayer(player, { severity: 'error', detail: t(error.message), summary: t('error') }));
}

async function playerCreateOrganizationRankHandler(rankCreate: IOrganizationRankCreate, { player }: ProcedureListenerInfo<PlayerMp>) {
  return playerCreateOrganizationRank(player, rankCreate)
    .then(rank => rank)
    .catch(error => catchError(error));
}

async function playerDeleteOrganizationRankHandler(rankId: string, { player }: ProcedureListenerInfo<PlayerMp>) {
  return playerDeleteOrganizationRank(player, rankId)
    .then(result => result)
    .catch(error => catchError(error));
}

on(ProcedureKey.SERVER_PLAYER_CREATE_ORGANIZATION, createOrganizationHandler);
on(ProcedureKey.SERVER_ORGANIZATION_MEMBER_INVITE, playerInvitePlayerToOrganizationHandler);
register(ProcedureKey.SERVER_ORGANIZATION_MEMBER_UPDATE, playerUpdateOrganizationMemberHandler);
register(ProcedureKey.SERVER_GET_ORGANIZATION, getOrganizationHandler);
register(ProcedureKey.SERVER_GET_ORGANIZATION_MEMBERS, getOrganizationMembersHandler);
register(ProcedureKey.SERVER_PLAYER_GET_ORGANIZATIONS, getOrganizationsHandler);
register(ProcedureKey.SERVER_ORGANIZATION_MEMBER_UNINVITE, playerUninviteMemberHandler);
register(ProcedureKey.SERVER_CREATE_ORGANIZATION_RANK, playerCreateOrganizationRankHandler);
register(ProcedureKey.SERVER_ORGANIZATION_RANK_DELETE, playerDeleteOrganizationRankHandler);
