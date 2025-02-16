import { CommandValidator, registerCommand } from '../player/player-command.service';
import { findPlayer } from '../player/util/player.util';
import { notifyPlayer } from '../player/util/player-notify.util';
import { t } from 'i18next';
import {
  invitePlayerToOrganization,
  playerChatOrganization,
  removePlayerFromOrganization
} from './organization.service';


const isInAnyOrganizationCommandValidator: CommandValidator = {
  validate: (player) => player.character.membership !== null,
  message: t('not_member_of_any_organization')
};

const canManageOrganizationMembersCommandValidator: CommandValidator = {
  validate: (player) => player.character.isLeader,
  message: t('you_cannot_manage_organization_members')
};

registerCommand({
  name: 'invite',
  aliases: ['inv'],
  params: ['target'],
  description: 'todo',
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
  description: 'todo',
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
  description: 'todo',
  validators: [isInAnyOrganizationCommandValidator],
  async handle(player: PlayerMp, ...content) {
    const message = content.join(' ');
    await playerChatOrganization(player, message);
  }
});
