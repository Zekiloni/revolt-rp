import { t } from 'i18next';
import { triggerClient } from '@libertymp/rage-rpc';
import {
  invitePlayerToOrganization,
  playerChatOrganization,
  playerLeaveOrganization,
  removePlayerFromOrganization
} from './organization.service';
import { CommandCategory, ICommandValidator, ProcedureKey } from '@revolt-rp/common';
import { findPlayer } from '../player/util/player.util';
import { notifyPlayer } from '../player/util/player-notify.util';
import { registerCommand } from '../player/player-command.service';


const isInAnyOrganizationCommandValidator: ICommandValidator<PlayerMp> = {
  validate: (player) => player.character.membership !== null,
  message: t('not_member_of_any_organization')
};

const canManageOrganizationMembersCommandValidator: ICommandValidator<PlayerMp> = {
  validate: (player) => player.character.isLeader,
  message: t('you_cannot_manage_organization_members')
};


registerCommand({
  name: 'invite',
  aliases: ['inv'],
  params: ['target'],
  category: CommandCategory.Organization,
  description: t('invite_command_description'),
  validators: [isInAnyOrganizationCommandValidator, canManageOrganizationMembersCommandValidator],
  handle(player: PlayerMp, targetQuery) {
    const target = findPlayer(targetQuery);

    if (!target || !target.character)
      return notifyPlayer(player, { severity: 'error', summary: t('not_found'), detail: t('player_target_not_found') });

    invitePlayerToOrganization(player, target)
      .catch((error) => notifyPlayer(player, { severity: 'error', summary: t('error'), detail: error.message }));
  }
});

registerCommand({
  name: 'uninvite',
  aliases: ['dismiss'],
  params: ['target'],
  category: CommandCategory.Organization,
  description: t('uninvite_command_description'),
  validators: [isInAnyOrganizationCommandValidator, canManageOrganizationMembersCommandValidator],
  handle(player: PlayerMp, targetQuery) {
    const target = findPlayer(targetQuery);

    if (!target || !target.character)
      return notifyPlayer(player, { severity: 'error', summary: t('not_found'), detail: t('player_target_not_found') });

    removePlayerFromOrganization(player, target)
      .catch((error) => notifyPlayer(player, { severity: 'error', summary: t('error'), detail: error.message }));
  }
});

registerCommand({
  name: 'o',
  aliases: ['f'],
  category: CommandCategory.Organization,
  description: t('organization_chat_command_description'),
  validators: [isInAnyOrganizationCommandValidator],
  async handle(player: PlayerMp, ...content) {
    const message = content.join(' ');
    await playerChatOrganization(player, message);
  }
});

registerCommand({
  name: 'organization',
  aliases: ['org', 'faction'],
  category: CommandCategory.Organization,
  description: t('organization_panel_command_description'),
  validators: [isInAnyOrganizationCommandValidator],
  handle(player: PlayerMp) {
    triggerClient(player, ProcedureKey.CLIENT_TOGGLE_ORGANIZATION_PANEL, player.character.membership.organization);
  }
});


registerCommand({
  name: 'leaveorganization',
  aliases: ['leaveorg', 'leavefaction'],
  category: CommandCategory.Organization,
  description: t('leave_organization_command_description'),
  validators: [isInAnyOrganizationCommandValidator],
  async handle(player: PlayerMp) {
    await playerLeaveOrganization(player);
  }
});
