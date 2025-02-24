import { t } from 'i18next';
import {
  IMemberUpdate,
  IOrganizationRankCreate,
  OrganizationPermissionType,
  PlayerSharedDataType
} from '@revolt-rp/common';
import { createPlayerOffer } from '../player/offer/player-offer.service';
import { Organization, OrganizationModel } from './organization.model';
import { notifyPlayer, sendOrganizationMessage } from '../player/util/player-notify.util';
import {
  getCharacterById,
  getPlayerOrganizationId,
  setPlayerOrganization,
  setPlayerOrganizationRank
} from '../player/character/character.service';
import { CharacterModel } from '../player/account-character.ref';
import {
  createOrganizationRank,
  deleteOrganizationRankById,
  getOrganizationRankById
} from './rank/organization-rank.service';
import { findPlayerByCharacterId } from '../player/util/player.util';
import { OrganizationRank } from './rank/organization-rank.model';
import { Types, UpdateQuery } from 'mongoose';


const permissionHierarchy = [
  OrganizationPermissionType.NORMAL,
  OrganizationPermissionType.MANAGE_MEMBERS,
  OrganizationPermissionType.MANAGE_ORGANIZATION
];

export const getOrganizationByName = async (name: string, shortName: string) => {
  return OrganizationModel.findOne({
    $or: [
      { name }, { shortName }
    ]
  }).exec();
};

export const getOrganizationById = (organizationId: string | Types.ObjectId) => {
  return OrganizationModel.findById(organizationId);
};

export const getOrganizationByRankId = (rankId: string) => {
  return OrganizationModel.findOne({ ranks: rankId });
};

export const getAllOrganizations = () => {
  return OrganizationModel.find()
    .populate('parentOrganization')
    .exec();
};

export const createOrganization = async (organization: Partial<Organization>) => {
  const alreadyExist = await getOrganizationByName(organization.name, organization.shortName);

  if (alreadyExist) {
    throw new Error(t('organization_name_taken'));
  }

  return await OrganizationModel.create(organization);
};

export const updateOrganization = async (organization: Organization | string, updateQuery: UpdateQuery<Organization>) => {
  if (organization instanceof Organization) {
    return organization.update(updateQuery);
  } else {
    OrganizationModel.findByIdAndUpdate(organization, updateQuery);
  }
};

export const getOrganizationMembers = async (organizationId: string) => {
  return CharacterModel.find({ 'membership.organization': organizationId })
    .populate('account')
    .populate('membership.rank')
    .exec();
};

export const getOnlineOrganizationMembers = (organizationId: string) => {
  return mp.players.toArray().filter((player) => getPlayerOrganizationId(player) === organizationId);
};

export const isAuthorizedForOrganization = async (
  player: PlayerMp,
  requiredPermission: OrganizationPermissionType
) => {
  if (player.character.isLeader) return true;
  if (!player.character.membership?.rank) return false;

  const rank = await getOrganizationRankById(player.character.membership.rank.id as string);

  return (
    permissionHierarchy.indexOf(rank.permission) >=
    permissionHierarchy.indexOf(requiredPermission)
  );
};

export const playerAcceptInvite = async (player: PlayerMp, organization: Organization, offerer: PlayerMp, rank?: OrganizationRank | null) => {
  setPlayerOrganization(player, organization);

  if (rank)
    setPlayerOrganizationRank(player, rank);

  notifyPlayer(player, {
    severity: 'success',
    summary: t('success'),
    detail: t('you_joined_organization', { organization: organization.name })
  });

  await player.character.save();

  if (offerer && mp.players.at(offerer.id))
    notifyPlayer(offerer, { severity: 'info', detail: t('organization_invite_accepted', { player: player.name }) });
};

export const playerDeclineInvite = async (player: PlayerMp, offerer: PlayerMp) => {
  notifyPlayer(player, { severity: 'info', detail: t('you_declined_organization_invite', { player: offerer.name }) });

  if (offerer && mp.players.at(offerer.id))
    notifyPlayer(offerer, { severity: 'info', detail: t('organization_invite_declined', { player: player.name }) });
};

export const invitePlayerToOrganization = async (player: PlayerMp, target: PlayerMp, rankId?: string) => {
  const organization = await getOrganizationById(getPlayerOrganizationId(player));
  let rank: OrganizationRank | null = null;

  if (!organization) {
    throw new Error(t('organization_not_found'));
  }

  if (target.getVariable<string | null>(PlayerSharedDataType.Organization)) {
    throw new Error(t('player_already_in_organization'));
  }

  if (rankId) {
    rank = await getOrganizationRankById(rankId);
  }

  const acceptOffer = async (_player: PlayerMp) => playerAcceptInvite(_player, organization, player, rank),
    declineOffer = async (_player: PlayerMp) => playerDeclineInvite(_player, player);

  createPlayerOffer(target,
    t('organization_invite', { organization: organization.name, offerer: player.name }),
    acceptOffer,
    declineOffer,
    player);
};


export const removePlayerFromOrganization = async (player: PlayerMp, target: PlayerMp) => {
  const organization = await getOrganizationById(getPlayerOrganizationId(player));

  if (!organization) {
    throw new Error(t('organization_not_found'));
  }

  if (organization.id !== getPlayerOrganizationId(target)) {
    throw new Error(t('not_in_same_organization'));
  }

  setPlayerOrganization(target, null);
  await target.character.save();

  notifyPlayer(target, {
    severity: 'info',
    summary: t('info'),
    detail: t('removed_from_organization', { organization: organization.name })
  });

  notifyPlayer(player, { severity: 'info', detail: t('player_removed_from_organization', { player: target.name }) });
};

export const removePlayerFromOrganizationByCharacterId = async (player: PlayerMp, characterId: string) => {
  const organization = await getOrganizationById(getPlayerOrganizationId(player));

  const target = findPlayerByCharacterId(characterId);
  if (!target) {
    return removePlayerFromOrganization(player, target);
  }

  const character = await getCharacterById(characterId);

  if (!organization) {
    throw new Error(t('organization_not_found'));
  }

  if (!character.membership)
    throw new Error(t('target_not_in_organization'));

  if (organization.id !== character.membership.organization) {
    throw new Error(t('not_in_same_organization'));
  }

  character.membership = null;
  await character.save();

  notifyPlayer(player, { severity: 'info', detail: t('player_removed_from_organization', { player: target.name }) });
};

export const makePlayerOrganizationLeader = async (player: PlayerMp, organization: Organization) => {
  setPlayerOrganization(player, organization, true);
  await player.character.save();

  notifyPlayer(player, {
    severity: 'info',
    summary: t('info'),
    detail: t('you_are_now_leader', { organization: organization.name })
  });
};

export const makePlayerOrganization = async (player: PlayerMp, organization: Organization) => {
  setPlayerOrganization(player, organization, false);
  await player.character.save();

  notifyPlayer(player, {
    severity: 'info',
    summary: t('info'),
    detail: t('you_are_now_member_of', { organization: organization.name })
  });
};

export const unsetPlayerOrganization = async (player: PlayerMp) => {
  setPlayerOrganization(player, null);
  await player.character.save();

  notifyPlayer(player, {
    severity: 'info',
    summary: t('info'),
    detail: t('you_are_no_longer_member_of_any_organization')
  });
};

export const playerChatOrganization = async (player: PlayerMp, message: string) => {
  const organization = await getOrganizationById((<Types.ObjectId>player.character.membership.organization));
  const rank = await getOrganizationRankById((<Types.ObjectId>player.character.membership.rank));

  if (organization) {
    mp.players.forEach((target) => {
      if (getPlayerOrganizationId(target) && organization.id) {
        sendOrganizationMessage(target, organization.color, `(( ${rank ? rank.name : ''} ${player.name} [${player.id}]: ${message} ))`);
      }
    });
  }
};


export async function playerUpdateOrganizationMember(player: PlayerMp, memberUpdate: IMemberUpdate) {
  const targetCharacter = await getCharacterById(memberUpdate.characterId);

  if (!targetCharacter) {
    throw new Error(t('player_target_not_found'));
  }

  if (!targetCharacter.membership)
    throw new Error(t('target_not_in_organization'));

  if (!(<Types.ObjectId>targetCharacter.membership.organization).equals((<Types.ObjectId>player.character.membership.organization)))
    throw new Error(t('not_in_same_organization'));

  const rank = await getOrganizationRankById(memberUpdate.rankId);

  if (!rank) {
    throw new Error(t('rank_not_found'));
  }

  targetCharacter.membership.rank = rank;
  await targetCharacter.save();

  const target = findPlayerByCharacterId(targetCharacter.id);

  if (target) {
    setPlayerOrganizationRank(target, rank);
    notifyPlayer(target, {
      severity: 'info',
      summary: t('info'),
      detail: t('rank_updated', { rank: rank.name })
    });
  }

  notifyPlayer(player, {
    severity: 'info',
    detail: t('target_rank_updated', { player: targetCharacter.fullName, rank: rank.name })
  });

  return targetCharacter;
}


export const playerCreateOrganizationRank = async (player: PlayerMp, rankCreate: IOrganizationRankCreate) => {
  const organization = await getOrganizationById(rankCreate.organizationId);

  if (!organization)
    throw new Error(t('organization_not_found'));

  const isAuth = await isAuthorizedForOrganization(player, OrganizationPermissionType.MANAGE_ORGANIZATION);
  if (!isAuth)
    throw new Error(t('not_authorized'));

  const rank = await createOrganizationRank(rankCreate.name, rankCreate.permission, rankCreate.salary);
  organization.ranks.push(rank);

  await organization.save();
  return rank;
};


export const playerDeleteOrganizationRank = async (player: PlayerMp, rankId) => {
  const organization = await getOrganizationByRankId(rankId);

  if (!organization)
    throw new Error(t('organization_not_found'));

  const isAuth = await isAuthorizedForOrganization(player, OrganizationPermissionType.MANAGE_ORGANIZATION);
  if (!isAuth)
    throw new Error(t('not_authorized'));

  await updateOrganization(organization, { $pull: { ranks: rankId } });
  return deleteOrganizationRankById(rankId);
};


export const playerLeaveOrganization = async (player: PlayerMp) => {
  await unsetPlayerOrganization(player);
  notifyPlayer(player, { severity: 'info', detail: t('you_left_organization') });
};


export async function deleteOrganization(organization: Organization) {
  const members = await getOrganizationMembers(organization.id);
  const onlineMembers = getOnlineOrganizationMembers(organization.id);

  for (const player of onlineMembers) {
    setPlayerOrganization(player, null);
    await player.character.save();
    notifyPlayer(player, { severity: 'info', detail: t('your_organization_removed') });
  }

  for (const member of members) {
    if (!onlineMembers.some((p) => p.character?.id === member.id)) {
      member.membership = null;
      member.isLeader = false;
      await member.save();
    }
  }

  return organization.remove();
}
