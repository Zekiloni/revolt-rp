

export type DrugEffectType =
  | 'health'
  | 'stamina'
  | 'strength'
  | 'addiction'
  | 'health_regen';

export interface IDrugEffectEntry {
  type: DrugEffectType;   // what stat/effect to modify
  amount: number;         // +5 or -5 or +1 per tick, etc.
  interval?: number;      // seconds between ticks (regen or gradual loss)
  duration?: number;      // optional override for this specific effect
}
export interface IDrugConfig {
  duration: number;
  intensity: number;
  effects: IDrugEffectEntry[];
}
