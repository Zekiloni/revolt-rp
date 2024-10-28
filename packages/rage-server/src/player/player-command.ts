import { hexColors } from '@bcrp-rage/common';
import { registerCommand } from './player-command.service';
import { findPlayer, sendProximityMessage } from './util/player.util';
import { isCharacterDescriptionSet } from './character/character.util';
import { t } from 'i18next';
import { notifyPlayer } from './util/player-notify.util';

registerCommand({
  name: 'me',
  params: ['action'],
  description: 'todo',
  handle(player: PlayerMp, ...args) {
    const content = `* ${player.name} ${[...args].join(' ')}`;
    sendProximityMessage(content, player.position, 10, hexColors.PURPLE);
  }
});


registerCommand({
  name: 'do',
  params: ['state'],
  description: 'todo',
  handle(player: PlayerMp, ...args) {
    const content = `* ${[...args].join(' ')} | ${player.name}`;
    sendProximityMessage(content, player.position, 10, hexColors.PURPLE);
  }
});


registerCommand({
  name: 'showme',
  description: 'todo',
  validators: [{
    validate: isCharacterDescriptionSet,
    message: t('character_description_not_set')
  }],
  handle(player: PlayerMp) {
    const content = `* ${player.name} ${player.character.description}`;
    sendProximityMessage(content, player.position, 10, [hexColors.LIGHT_PURPLE, hexColors.LIGHT_PURPLE]);
  }
});


registerCommand({
  name: 'pm',
  description: 'todo',
  params: ['target', 'message'],
  handle(player: PlayerMp, targetQuery: string, ...content: string[]) {
    const target = findPlayer(targetQuery);

    if (!target || !target.character)
      return notifyPlayer(player, { severity: 'error', summary: t('not_found'), detail: t('player_target_not_found') });

    const message = [...content].join(' ');

    target.outputChatBox(t('private_message_from', {
      color: hexColors.YELLOW_LIGHT,
      name: player.character.fullName,
      id: player.id,
      message
    }));

    player.outputChatBox(t('private_message_to', {
      color: hexColors.YELLOW,
      name: target.character.fullName,
      id: target.id,
      message
    }));
  }
});


registerCommand({
  name: 'whisper',
  aliases: ['w'],
  description: 'todo',
  params: ['target', 'message'],
  handle(player: PlayerMp, targetQuery: string, ...content: string[]) {
    const target = findPlayer(targetQuery);

    if (!target || !target.character)
      return notifyPlayer(player, { severity: 'error', summary: t('not_found'), detail: t('player_target_not_found') });

    const text = [...content].join(' ');

    [player, target].forEach(_target => _target.outputChatBox(`!${hexColors.GREY85}` + t('whisper_say', {
      name: player.character.fullName,
      text
    })));

    sendProximityMessage(`> ` + t('whispers_to', {
      name: player.character.fullName,
      target: target.character.fullName
    }), player.position, 10, hexColors.PURPLE);
  }
});


registerCommand({
  name: 'low',
  aliases: ['l'],
  params: ['content'],
  description: 'todo',
  handle(player: PlayerMp, ...args) {
    const content = [...args].join(' ');
    sendProximityMessage(t('says_low', {
      name: player.character.fullName,
      text: content
    }), player.position, 5, hexColors.WHITE);
  }
});


registerCommand({
  name: 'shout',
  aliases: ['s'],
  params: ['content'],
  description: 'todo',
  handle(player: PlayerMp, ...args) {
    const content = [...args].join(' ');
    sendProximityMessage(t('shouts', {
      name: player.character.fullName,
      text: content
    }), player.position, 20, hexColors.WHITE);
  }
});


registerCommand({
  name: 'coin',
  description: 'todo',
  handle(player: PlayerMp) {
    const results = t('coin_flip');
    const randomIndex = Math.floor(Math.random() * results.length);

    sendProximityMessage(t('throws_a_coin', {
      name: player.character.fullName,
      result: results[randomIndex]
    }), player.position, 10, hexColors.PURPLE);
  }
});
