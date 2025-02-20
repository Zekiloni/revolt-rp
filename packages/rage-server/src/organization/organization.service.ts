import { t } from 'i18next';
import { IMemberUpdate, PlayerSharedDataType } from '@revolt-rp/common';
import { createPlayerOffer } from '../player/offer/player-offer.service';
import { Organization, OrganizationModel } from './organization.model';
import { notifyPlayer, sendOrganizationMessage } from '../player/util/player-notify.util';
import {
  getCharacterById,
  getPlayerOrganizationId,
  setPlayerOrganization, setPlayerOrganizationRank, updateCharacter
} from '../player/character/character.service';
import { CharacterModel } from '../player/account-character.ref';
import { getRankById } from './rank/organization-rank.service';
import { findPlayerByCharacterId } from '../player/util/player.util';
import { OrganizationRank } from './rank/organization-rank.model';


export const getOrganizationByName = async (name: string, shortName: string) => {
  return OrganizationModel.findOne({
    $or: [
      { name }, { shortName }
    ]
  }).exec();
};

export const getOrganizationById = (organizationId: string) => {
  return OrganizationModel.findById(organizationId);
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


export const getOrganizationMembers = async (organizationId: string) => {
  return CharacterModel.find({ 'membership.organization': organizationId })
    .populate('account')
    .populate('membership.rank')
    .exec();
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
    rank = await getRankById(rankId);
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

export const playerChatOrganization = async (player: PlayerMp, message: string) => {
  const organization = await getOrganizationById(getPlayerOrganizationId(player));

  if (organization) {
    mp.players.forEach((target) => {
      if (getPlayerOrganizationId(target) && organization.id) {
        sendOrganizationMessage(target, organization.color, `(( ${player.name} [${player.id}]: ${message} ))`);
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

  if (targetCharacter.membership.organization !== player.character.membership.organization)
    throw new Error(t('not_in_same_organization'));

  const rank = await getRankById(memberUpdate.rankId);

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
