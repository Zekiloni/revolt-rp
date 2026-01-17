import { CharacterSpawnType } from '@revolt-rp/common';

export const characterConfig = {
  defaultPosition: { x: 1962.62, y: 3841.2, z: 32.73 },
  defaultDimension: 0,
  defaultHeading: 90,
  defaultSpawn: { type: CharacterSpawnType.INITIAL_SPAWN },
  defaultMaxVehicles: 3,
  maxProperties: 3,
  defaultLevel: 1,
  defaultCash: 2300,
  defaultHealth: 100,
  defaultBankBalance: 17500,
  woundedHealth: 45,
  giveUpTime: 30,
  skillMultiplier: {
    fishing: 0.75,
  }
}
