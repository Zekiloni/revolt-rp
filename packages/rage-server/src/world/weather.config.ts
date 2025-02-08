export const weatherConfig = {
  summer: {
    temperature: { min: 25, max: 40 },
    weatherTypes: {
      primary: [RageEnums.Weather.EXTRA_SUNNY, RageEnums.Weather.CLEAR],
      secondary: [RageEnums.Weather.CLOUDS, RageEnums.Weather.NEUTRAL, RageEnums.Weather.OVERCAST]
    }
  },
  autumn: {
    temperature: { min: 10, max: 20 },
    weatherTypes: {
      primary: [RageEnums.Weather.FOGGY, RageEnums.Weather.OVERCAST, RageEnums.Weather.RAIN],
      secondary: [RageEnums.Weather.CLEAR, RageEnums.Weather.CLOUDS]
    }
  },
  winter: {
    temperature: { min: -5, max: 5 },
    weatherTypes: {
      primary: [RageEnums.Weather.SNOW, RageEnums.Weather.SNOW_LIGHT, RageEnums.Weather.BLIZZARD],
      secondary: [RageEnums.Weather.XMAS, RageEnums.Weather.CLOUDS, RageEnums.Weather.CLEAR]
    }
  },
  spring: {
    temperature: { min: 10, max: 25 },
    weatherTypes: {
      primary: [RageEnums.Weather.CLOUDS, RageEnums.Weather.CLEAR, RageEnums.Weather.FOGGY],
      secondary: [RageEnums.Weather.RAIN, RageEnums.Weather.OVERCAST]
    }
  }
};
