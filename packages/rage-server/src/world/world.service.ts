import { WorldDummyEntityType, WorldSharedDateType } from '@revolt-rp/common';

export const worldDummy = mp.dummies.new(WorldDummyEntityType, {});

export function setWorldVariable(key: WorldSharedDateType, value: any): void {
  worldDummy.setVariable(key, value);
}

export const getWorldVariable = <T>(key: WorldSharedDateType): T => worldDummy.getVariable(key) as T;

