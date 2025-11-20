
export const isNumber = (value: string) =>!isNaN(Number(value));

export const randomBetween = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
}
