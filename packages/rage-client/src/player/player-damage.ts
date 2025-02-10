import { on, triggerBrowser, triggerServer } from '@libertymp/rage-rpc';
import { gameUiConfig, GameUiKey, IPlayerDamageData, ProcedureKey } from '@revolt-rp/common';
import { browser, hideGameInterface, showGameInterface } from '../core/browser';
import { getAdminDuty } from './util/player-data.util';


let isPlayerDamageInfoVisible = gameUiConfig.damageInfo.isActive;

function togglePlayerDamageInfo(damages?: IPlayerDamageData<PlayerMp>[]) {
  if (!isPlayerDamageInfoVisible && damages) {
    isPlayerDamageInfoVisible = true;
    showGameInterface(GameUiKey.DamageInfo);
    setTimeout(() => triggerBrowser(browser, ProcedureKey.BROWSER_SET_PLAYER_DAMAGES, damages), 250);
  } else {
    isPlayerDamageInfoVisible = false;
    hideGameInterface(GameUiKey.DamageInfo);
  }
}


function encodeBoneIndex(boneIndex: number, damage: number) {
  if (boneIndex < 0 || boneIndex > 127) {
    throw new Error('boneIndex must be between 0 and 127');
  }
  if (damage < 0 || damage > 10000) {
    throw new Error('damage must be between 0 and 10000');
  }

  return (boneIndex & 0x7F) | ((damage & 0x3FFF) << 7);
}

function decodeBoneIndex(encoded: number) {
  const boneIndex = encoded & 0x7F;
  const damage = (encoded >> 7) & 0x3FFF;
  return { boneIndex, damage };
}

function incomingDamageHandler(
  sourceEntity: EntityMp,
  sourcePlayer: PlayerMp,
  targetEntity: EntityMp,
  weaponHash: number,
  boneIndex: number,
  encodedDamage: number
) {
  const decodeValue = decodeBoneIndex(encodedDamage);
  mp.game.weapon.setCurrentDamageEventAmount(decodeValue.damage);

  if (sourceEntity.type === 'player' && sourcePlayer) {
    if (targetEntity.type === 'player') {
      const target = targetEntity as PlayerMp;

      mp.gui.chat.push(`Incoming damage from ${sourcePlayer.name} to ${target.name} with weapon ${weaponHash} on bone ${boneIndex} with damage ${encodedDamage}`);
      mp.gui.chat.push(`Decoded boneIndex: ${decodeValue.boneIndex}, damage: ${decodeValue.damage}`);

      if (target.remoteId === mp.players.local.remoteId) {
        const playerDamage: IPlayerDamageData<PlayerMp> = {
          source: sourcePlayer,
          weaponHash,
          boneIndex: decodeValue.boneIndex,
          damage: encodedDamage
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
  damage: number) {
  // todo cancel dmg if already dead
  //mp.game.weapon.cancelCurrentDamageEvent();

  // todo check has armour and reduce damage
  const encodeValue = encodeBoneIndex(boneIndex, damage);
  mp.game.weapon.setCurrentDamageEventAmount(encodeValue);


  if (targetPlayer) {
    if (getAdminDuty(targetPlayer)) {
      mp.game.weapon.cancelCurrentDamageEvent();
      return true;
    }
  }

}

mp.events.add({
  incomingDamage: incomingDamageHandler,
  outgoingDamage: outgoingDamageHandler
});

on(ProcedureKey.CLIENT_PLAYER_TOGGLE_DAMAGE_INFO, togglePlayerDamageInfo);
