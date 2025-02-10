import { IForecast, IWeatherInfo, WorldSharedDateType } from '@revolt-rp/common';
import { weatherConfig } from './weather.config';
import { logger } from '../core/logger.config';
import { setWorldVariable } from './world.service';


const worldLogger = logger('world');

const weatherState: IWeatherInfo<RageEnums.Weather> = {
  currentWeather: RageEnums.Weather.EXTRA_SUNNY,
  temperature: 0,
  frozen: false,
  forecast: []
};


function getRandomInterval(): number {
  return (Math.random() * (2 - 1) + 1) * 60 * 60 * 1000;
}


export function getCurrentSeason(): keyof typeof weatherConfig {
  const month = new Date().getMonth() + 1;
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'autumn';
  if (month >= 12 || month <= 2) return 'winter';
  return 'spring';
}


export function generateForecast(): void {
  const season = getCurrentSeason();
  const { primary, secondary } = weatherConfig[season].weatherTypes;
  const { min, max } = weatherConfig[season].temperature;

  weatherState.forecast = [];

  for (let i = 0; i < 5; i++) {
    const weather = Math.random() < 0.7
      ? primary[Math.floor(Math.random() * primary.length)]
      : secondary[Math.floor(Math.random() * secondary.length)];

    const temperature = Math.floor(Math.random() * (max - min + 1) + min);

    weatherState.forecast.push({ weather, temperature });
  }

  weatherState.currentWeather = weatherState.forecast[0].weather;
  weatherState.temperature = weatherState.forecast[0].temperature;
  syncWeather();
}


export function syncWeather(): void {
  if (weatherState.frozen) return;
  mp.world.setWeatherTransition(weatherState.currentWeather, 30);

  setWorldVariable(WorldSharedDateType.Weather, weatherState.currentWeather);
  setWorldVariable(WorldSharedDateType.Temperature, weatherState.temperature);

  worldLogger.log('info', `Updated Weather: ${weatherState.currentWeather}, Temp: ${weatherState.temperature}°C`);
}


export function setWeatherCycle(): void {
  setInterval(() => {
    if (!weatherState.frozen) {
      weatherState.forecast.shift();
      weatherState.forecast.push(generateForecastEntry());
      weatherState.currentWeather = weatherState.forecast[0].weather;
      weatherState.temperature = weatherState.forecast[0].temperature;
      syncWeather();
    }
  }, getRandomInterval());
}


export function freezeWeather(freeze: boolean): void {
  weatherState.frozen = freeze;
  worldLogger.log('info', `Weather is now ${freeze ? 'frozen' : 'dynamic'}`);
}


export function getForecast(): IForecast<RageEnums.Weather>[] {
  return weatherState.forecast;
}


export function generateForecastEntry(): IForecast<RageEnums.Weather> {
  const season = getCurrentSeason();
  const { primary, secondary } = weatherConfig[season].weatherTypes;
  const { min, max } = weatherConfig[season].temperature;

  return {
    weather: Math.random() < 0.7
      ? primary[Math.floor(Math.random() * primary.length)]
      : secondary[Math.floor(Math.random() * secondary.length)],
    temperature: Math.floor(Math.random() * (max - min + 1) + min)
  };
}


export const setWeather = (weather: RageEnums.Weather, frozen: boolean) => {
  freezeWeather(frozen)
  weatherState.currentWeather = weather;
  mp.world.setWeatherTransition(weatherState.currentWeather, 30);
  setWorldVariable(WorldSharedDateType.Weather, mp.world.weather);
};
