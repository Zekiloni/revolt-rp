export const WeatherTypes = Object.freeze({
  EXTRASUNNY: "EXTRASUNNY",
  CLEAR: "CLEAR",
  CLOUDS: "CLOUDS",
  SMOG: "SMOG",
  FOGGY: "FOGGY",
  OVERCAST: "OVERCAST",
  RAIN: "RAIN",
  THUNDER: "THUNDER",
  CLEARING: "CLEARING",
  NEUTRAL: "NEUTRAL",
  SNOW: "SNOW",
  BLIZZARD: "BLIZZARD",
  SNOWLIGHT: "SNOWLIGHT",
  XMAS: "XMAS",
} as const);

export type WeatherType = keyof typeof WeatherTypes;
