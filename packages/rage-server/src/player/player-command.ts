import { t } from 'i18next';
import { triggerBrowsers, triggerClient } from '@libertymp/rage-rpc';
import { GameUiKey, hexColors, isNumber, ProcedureKey, rgbColors } from '@revolt-rp/common';
import {
  filterPlayer,
  findPlayer,
  sendProximityMessage,
  setPlayerTextBubble,
  showPlayerGameInterface
} from './util/player.util';
import { getPlayerDamage, playerGiveUp } from './damage/player-damage.service';
import { isCharacterDescriptionSet } from './character/character.util';
import { registerCommand } from './player-command.service';
import { notifyPlayer, sendInfoMessage } from './util/player-notify.util';
import { playerSendRadioMessage } from './inventory/player-handheld-radio.service';
import { playerBuyInteraction } from './player-buy.service';
import { giveMoney } from './character/character.service';


registerCommand({
  name: 'b',
  params: ['content'],
  description: t('local_ooc_command_description'),
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
    }), player.position, 5, [hexColors.WHITE_PALETTE[2], hexColors.WHITE_PALETTE[3], hexColors.whitesmoke[4]]);
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
    }), player.position, 20, hexColors.WHITE_PALETTE);
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

    sendProximityMessage(message, player.position, 10, hexColors.WHITE_PALETTE, [target]);
    target.outputChatBox(`!{${hexColors.PURPLE[0]}}[!] !{${hexColors.WHITE_PALETTE}}${message}`);
  }
});


registerCommand({
  name: 'giveup',
  description: 'todo',
  async handle(player: PlayerMp) {
    if (!player.character.isWounded)
      return notifyPlayer(player, {
        severity: 'error',
        summary: t('bad_request'),
        detail: t('you_are_not_dead_or_wounded')
      });

    await playerGiveUp(player);
  }
});

registerCommand({
  name: 'damages',
  description: 'todo',
  handle(player: PlayerMp, targetQuery: string) {
    const target = findPlayer(targetQuery);

    if (!target || !target.character)
      return notifyPlayer(player, { severity: 'error', summary: t('not_found'), detail: t('player_target_not_found') });

    const damages = getPlayerDamage(target);

    if (damages && damages.length)
      damages.forEach(damage => {
        if (damage.source)
          player.outputChatBox(`!{${hexColors.YELLOW}}[${damage.timestamp}] ${damage.source.name} - ${damage.boneIndex} - ${damage.damage} ${damage.weaponHash}, caliber: ${damage.caliberType}`);
        else
          player.outputChatBox(`!{${hexColors.YELLOW}}[${damage.timestamp}] Source Disconnected ${damage.damage} - ${damage.boneIndex} - ${damage.weaponHash}, caliber: ${damage.caliberType}`);
      });

    triggerClient(player, ProcedureKey.CLIENT_PLAYER_TOGGLE_DAMAGE_INFO, [target.id, damages]);
  }
});


registerCommand({
  name: 'r',
  description: 'todo',
  aliases: ['radio'],
  params: ['content'],
  handle(player: PlayerMp, ...args) {
    const content = [...args].join(' ');
    playerSendRadioMessage(player, content);
  }
});


registerCommand({
  name: 'buy',
  description: 'todo',
  async handle(player: PlayerMp) {
    await playerBuyInteraction(player);
  }
});


registerCommand({
  name: 'clearmychat',
  aliases: ['cmc'],
  description: 'todo',
  handle(player: PlayerMp) {
    triggerBrowsers(player, ProcedureKey.BROWSER_CLEAR_CHAT);
  }
});


registerCommand({
  name: 'pay',
  description: 'todo',
  params: ['target', 'amount'],
  async handle(player: PlayerMp, targetQuery: string, amountString: string) {
    if (!isNumber(amountString))
      return notifyPlayer(player, {
        severity: 'error',
        summary: t('bad_request'),
        detail: t('invalid_param_type', { param: 'amount', type: 'number' })
      });

    const amount = Number(amountString);
    if (amount <= 0)
      return notifyPlayer(player, {
        severity: 'error',
        summary: t('bad_request'),
        detail: t('invalid_param_value', { param: 'amount', value: amount })
      });

    if (amount > player.character.cash)
      return notifyPlayer(player, {
        severity: 'error',
        summary: t('bad_request'),
        detail: t('not_enough_money')
      });

    const target = findPlayer(targetQuery);

    if (!target || !target.character)
      return notifyPlayer(player, { severity: 'error', summary: t('not_found'), detail: t('player_target_not_found') });

    if (player.dist(target.position) > 1.5)
      return notifyPlayer(player, { severity: 'error', summary: t('bad_request'), detail: t('target_not_close') });

    await giveMoney(player, -amount);
    await giveMoney(target, amount);
  }
});


registerCommand({
  name: 'whereami',
  description: 'todo',
  handle(player: PlayerMp) {
    const { x, y, z } = player.position;
    const { heading, dimension } = player;
    const info = `X ${x.toFixed(2)}, Y ${y.toFixed(2)}, Z ${z.toFixed(2)}, H ${heading.toFixed(2)} D ${dimension}`;
    sendInfoMessage(player, info);
  }
});

registerCommand({
  name: 'help',
  description: 'todo',
  handle(player: PlayerMp) {
    showPlayerGameInterface(player, GameUiKey.HelpMenu);
  }
});

