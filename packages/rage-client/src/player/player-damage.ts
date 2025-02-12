import { on, triggerBrowser, triggerServer } from '@libertymp/rage-rpc';
import { gameUiConfig, GameUiKey, IPlayerDamageData, ProcedureKey } from '@revolt-rp/common';
import { getAdminDuty, getIsWounded } from './util/player-data.util';
import { browser, hideGameInterface, showGameInterface } from '../core/browser';


let isPlayerDamageInfoActive = gameUiConfig.damageInfo.isActive;

function togglePlayerDamageInfo(data?: [number, IPlayerDamageData<PlayerMp>[]]) {
  if (isPlayerDamageInfoActive || data) {
    isPlayerDamageInfoActive = false;
    hideGameInterface(GameUiKey.DamageInfo);
  } else {
    const [remotePlayerId, damages] = data;
    const target = mp.players.atRemoteId(remotePlayerId);
    if (target) {
      isPlayerDamageInfoActive = true;
      showGameInterface(GameUiKey.DamageInfo);
      setTimeout(() => triggerBrowser(browser, ProcedureKey.BROWSER_SET_PLAYER_DAMAGES, [target.name, damages]), 250);
    }
  }
}


function encodeDamageEvent(boneIndex: number, damage: number) {
  if (boneIndex < 0 || boneIndex > 127) {
    throw new Error('boneIndex must be between 0 and 127');
  }
  if (damage < 0 || damage > 10000) {
    throw new Error('damage must be between 0 and 10000');
  }

  return (boneIndex & 0x7F) | ((damage & 0x3FFF) << 7);
}

function decodeDamageEvent(encoded: number) {
  const boneIndex = encoded & 0x7F;
  const damage = (encoded >> 7) & 0x3FFF;
  return { boneIndex, damage };
}

function incomingDamageHandler(
  sourceEntity: EntityMp,
  sourcePlayer: PlayerMp,
  targetEntity: EntityMp,
  weaponHash: number,
  encodedBoneIndex: number,
  encodedDamage: number
) {
  const { boneIndex, damage } = decodeDamageEvent(encodedDamage);
  mp.game.weapon.setCurrentDamageEventAmount(damage);

  if (sourceEntity.type === RageEnums.EntityType.PLAYER && sourcePlayer) {
    if (targetEntity.type === RageEnums.EntityType.PLAYER) {
      const target = targetEntity as PlayerMp;

      mp.gui.chat.push(`Incoming damage from ${sourcePlayer.name} to ${target.name} with weapon ${weaponHash} on bone ${encodedBoneIndex} with damage ${encodedDamage}`);
      mp.gui.chat.push(`Decoded boneIndex: ${boneIndex}, damage: ${damage}`);

      if (target.remoteId === mp.players.local.remoteId) {
        const playerDamage: IPlayerDamageData<PlayerMp> = {
          source: sourcePlayer,
          weaponHash,
          boneIndex: boneIndex,
          damage: damage
        };
        triggerServer(ProcedureKey.SERVER_PLAYER_DAMAGE, playerDamage);
      }
    }
  }
}

function outgoingDamageHandler(
  sourceEntity: EntityMp,
  targetEntity: EntityMp,
  targetPlayer: PlayerMp,
  weapon: number,
  boneIndex: number,
  damage: number
) {
  if (targetPlayer) {
    if (getAdminDuty(targetPlayer) || getIsWounded(targetPlayer)) {
      mp.game.weapon.cancelCurrentDamageEvent();
      return true;
    }

    mp.gui.chat.push(`Outgoing damage from ${sourceEntity.type} to ${targetEntity.type} with weapon ${weapon} on bone ${boneIndex} with damage ${damage}`);

    const encodeValue = encodeDamageEvent(boneIndex, damage);
    mp.game.weapon.setCurrentDamageEventAmount(encodeValue);

    mp.gui.chat.push(`Outgoing damage, Encoded encodeValue: ${encodeValue}`);
  }
}


mp.events.add({
  incomingDamage: incomingDamageHandler,
  outgoingDamage: outgoingDamageHandler
});

on(ProcedureKey.CLIENT_PLAYER_TOGGLE_DAMAGE_INFO, togglePlayerDamageInfo);
