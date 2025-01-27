import { t } from 'i18next';
import { hexColors, rgbColors } from '@revolt-rp/common';
import { filterPlayer, findPlayer, sendProximityMessage, setPlayerTextBubble } from './util/player.util';
import { isCharacterDescriptionSet } from './character/character.util';
import { registerCommand } from './player-command.service';
import { notifyPlayer } from './util/player-notify.util';


registerCommand({
  name: 'b',
  params: ['content'],
  description: 'todo',
  handle(player: PlayerMp, ...args) {
    const content = `(( ${player.name} [${player.id}]: ${[...args].join(' ')} ))`;
    sendProximityMessage(content, player.position, 10, hexColors.GREY);
  }
});

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
  name: 'ame',
  params: ['action'],
  description: 'todo',
  handle(player: PlayerMp, ...args) {
    const content = `* ${player.name} ${[...args].join(' ')}`;
    setPlayerTextBubble(player, {
      content,
      duration: 5000,
      color: [...rgbColors.PURPLE, 255],
      testLos: false,
      distance: 12.5
    });
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

    target.outputChatBox(`!{${hexColors.YELLOW_LIGHT}}` + t('private_message_from', {
      name: player.name,
      id: player.id,
      message
    }));

    player.outputChatBox(`!{${hexColors.YELLOW}}` + t('private_message_to', {
      name: target.name,
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

    [player, target].forEach(_target => _target.outputChatBox(`!{${hexColors.GREY85}}` + t('whisper_say', {
      name: player.name,
      text
    })));

    sendProximityMessage(`> ` + t('whispers_to', {
      name: player.name,
      target: target.name
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
      name: player.name,
      text: content
    }), player.position, 5, [hexColors.WHITE[2], hexColors.WHITE[3], hexColors.whitesmoke[4]]);
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
      name: player.name,
      text: content
    }), player.position, 20, hexColors.WHITE);
  }
});


registerCommand({
  name: 'coin',
  description: 'todo',
  handle(player: PlayerMp) {
    const results = [t('coin_flip_head'), t('coin_flip_tail')];
    const randomIndex = Math.floor(Math.random() * results.length);

    sendProximityMessage(t('throws_a_coin', {
      name: player.name,
      result: results[randomIndex]
    }), player.position, 10, hexColors.PURPLE);
  }
});

registerCommand({
  name: 'id',
  description: 'todo',
  params: ['query'],
  handle(player: PlayerMp, targetQuery: string) {
    const result: PlayerMp[] = [];
    if (!isNaN(Number(targetQuery))) {
      const target = findPlayer(targetQuery);

      if (target) {
        result.push(target);
      }
    } else {
      const targets = filterPlayer(targetQuery);
      targets.forEach(target => result.push(target));
    }

    if (!result.length)
      return notifyPlayer(player, { severity: 'error', summary: t('not_found'), detail: t('player_target_not_found') });

    result
      .filter(target => target.account && target.character)
      .forEach(target => player.outputChatBox(`[${target.id}] ${target.name} (${target.account.username})`));
  }
});



registerCommand({
  name: 'to',
  params: ['target', 'content'],
  description: 'todo',
  handle(player: PlayerMp, targetQuery: string, ...content: string[]) {
    const target = findPlayer(targetQuery);

    if (!target || !target.character)
      return notifyPlayer(player, { severity: 'error', summary: t('not_found'), detail: t('player_target_not_found') });

    if (player.id === target.id)
      return;

    if (player.dist(target.position) > 7.5)
      return notifyPlayer(player, { severity: 'error', summary: t('bad_request'), detail: t('target_not_close') });

    const message = `${player.name} (${t('to')} ${target.name}): ${[...content].join(' ')}`;

    sendProximityMessage(message, player.position, 10, hexColors.WHITE, [target]);
    target.outputChatBox(`!{${hexColors.PURPLE[0]}}[!] !{${hexColors.WHITE}}${message}`);
  }
});
