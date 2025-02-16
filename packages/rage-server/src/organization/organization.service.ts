import { t } from 'i18next';
import { PlayerSharedDataType } from '@revolt-rp/common';
import { createPlayerOffer } from '../player/offer/player-offer.service';
import { Organization, OrganizationModel } from './organization.model';
import { notifyPlayer, sendOrganizationMessage } from '../player/util/player-notify.util';
import { getPlayerOrganizationId, setPlayerOrganization } from '../player/character/character.service';


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


export const playerAcceptInvite = async (player: PlayerMp, organization: Organization, offerer: PlayerMp) => {
  setPlayerOrganization(player, organization);

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

export const invitePlayerToOrganization = async (player: PlayerMp, target: PlayerMp) => {
  const organization = await getOrganizationById(getPlayerOrganizationId(player));

  if (!organization) {
    throw new Error(t('organization_not_found'));
  }

  if (target.getVariable<string | null>(PlayerSharedDataType.Organization)) {
    throw new Error(t('player_already_in_organization'));
  }

  const acceptOffer = async (_player: PlayerMp) => playerAcceptInvite(_player, organization, player),
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
