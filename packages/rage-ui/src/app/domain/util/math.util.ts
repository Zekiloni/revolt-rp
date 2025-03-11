
export const calculate = (value: string) => {
  return new Function('return ' + value)();
}
