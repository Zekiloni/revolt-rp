

const LEVEL_UP_QUOTA = 2;

export const calculateLevelUpQuota = (nextLevel: number) => {
  return (nextLevel * (nextLevel + 1) / 2) * LEVEL_UP_QUOTA;
}
