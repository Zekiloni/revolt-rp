import { triggerClient } from '@libertymp/rage-rpc';
import { AddictionType, ProcedureKey, randomBetween } from '@revolt-rp/common';
import { getAllBaseItems } from '@revolt-rp/core';
import { DrugItem } from '../item/registry/drug-item.model';
import { setPlayerHealth, setPlayerStamina, setPlayerStrength, updateAddiction } from './character/character.service';


const getDrugItem = (addictionType: AddictionType) => {
  return getAllBaseItems().find(item => item instanceof DrugItem && item.addiction === addictionType) as DrugItem;
}


export function playerDrugHandler(player: PlayerMp) {
  const effects = player.character.drugs;
  if (!effects || effects.length === 0) {
    return;
  }

  effects.forEach(effect => {
    effect.duration --;
    if (effect.duration <= 0) {
      player.character.drugs = player.character.drugs.filter(e => e !== effect);
    } else {
      effect.effectLevel = Math.max(0, effect.effectLevel - 1);
      if (effect.effectLevel === 0) {
        player.character.drugs = player.character.drugs.filter(e => e !== effect);
      }

      const drugItem = getDrugItem(effect.addictionType);

      if (drugItem) {
        drugItem.drugConfig.effects.forEach(cfg => {
          switch (cfg.type) {
            case 'stamina':
              setPlayerStamina(player, player.character.stamina + cfg.amount * effect.effectLevel);
              break;

            case 'strength':
              setPlayerStrength(player, player.character.strength + cfg.amount * effect.effectLevel);
              break;

            case 'health': {
              const healAmount = cfg.amount * effect.effectLevel;
              setPlayerHealth(player, player.health + healAmount);
              break;
            }

            case 'addiction': {
              updateAddiction(player.character, effect.addictionType, cfg.amount * effect.effectLevel);
              break;
            }
          }
        })
      }
    }
  })

  handleWithdrawal(player);
}
function handleWithdrawal(player: PlayerMp) {
  const character = player.character;
  const now = Date.now();

  character.addictions.forEach(add => {
    const level = add.level;

    if (level === 1) return; // Level 1 has no withdrawal symptoms

    // Initialize withdrawal object if missing
    if (!add.withdrawal) {
      add.withdrawal = {
        lastHpDrainAt: new Date(),
        recoveryCheckAt: new Date(),
      };
    }

    // 1. HP LOSS
    const hpLossMinutesArr = [0, 30, 30, 20, 15];
    const hpLossAmountArr = [0, 15, 30, 30, 30];

    const hpLossMs = hpLossMinutesArr[level - 1] * 60 * 1000;

    if (now - add.withdrawal.lastHpDrainAt.getTime() >= hpLossMs) {
      setPlayerHealth(player, Math.max(0, player.health - hpLossAmountArr[level - 1]))
      add.withdrawal.lastHpDrainAt = new Date();
    }

    // 2. SCREEN EFFECTS & /ame (Level 4–5)
    if (level >= 4) {
      const durationMinutes = level === 4 ? 1 : 2;
      triggerClient(player, ProcedureKey.CLIENT_WITHDRAWAL_SCREEN_EFFECT, durationMinutes);
      player.invoke("sendAme", "shows visible withdrawal symptoms.");
    }

    // 3. RANDOM ADDICTION DECAY
    const decayHoursArr = [48, 52, 56, 60, 65];
    const decayChanceArr = [50, 40, 30, 25, 20];

    const decayMs = decayHoursArr[level - 1] * 3600 * 1000;
    const decayChance = decayChanceArr[level - 1];

    if (now - add.withdrawal.recoveryCheckAt.getTime() >= decayMs) {
      const decayRanges = [
        [1.5, 3.0],
        [2.0, 3.5],
        [2.5, 4.0],
        [3.0, 5.0],
        [4.0, 6.0],
      ];

      if (Math.random() * 100 < decayChance) {
        const [min, max] = decayRanges[level - 1];
        const amount = randomBetween(min, max);
        add.level = Math.max(0, add.level - amount);
      }

      add.withdrawal.recoveryCheckAt = new Date();
    }
  });

  character.markModified("addictions");
}
