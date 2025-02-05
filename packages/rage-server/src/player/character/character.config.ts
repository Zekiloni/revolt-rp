import { CharacterSpawnType } from '@revolt-rp/common';

export const characterConfig = {
  defaultPosition: new mp.Vector3(1962.62, 3841.2, 32.73),
  defaultDimension: 0,
  defaultHeading: 90,
  defaultSpawn: { type: CharacterSpawnType.INITIAL_SPAWN },
  defaultMaxVehicles: 3,
  maxProperties: 3,
  defaultLevel: 1,
  defaultCash: 2300,
  defaultHealth: 100,
  defaultBankBalance: 17500,
  woundedHealth: 45
}
