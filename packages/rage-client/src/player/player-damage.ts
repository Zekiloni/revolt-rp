import { triggerServer } from '@libertymp/rage-rpc';
import { IPlayerDamageData, ProcedureKey } from '@revolt-rp/common';
import { getAdminDuty } from './util/player-data.util';


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
  if (sourceEntity.type === 'player' && sourcePlayer) {
    if (targetEntity.type === 'player') {
      const target = targetEntity as PlayerMp;
      const decodeValue = decodeBoneIndex(encodedDamage);
      mp.game.weapon.setCurrentDamageEventAmount(decodeValue.damage);
      mp.gui.chat.push(`Incoming damage from ${sourcePlayer.name} to ${target.name} with weapon ${weaponHash} on bone ${boneIndex} with damage ${encodedDamage}`);
      mp.gui.chat.push(`Decoded boneIndex: ${decodeValue.boneIndex}, damage: ${decodeValue.damage}`);

      if (target.remoteId === mp.players.local.remoteId) {
        const playerDamage: IPlayerDamageData<PlayerMp> = {
          source: sourcePlayer,
          weaponHash,
          boneIndex,
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
