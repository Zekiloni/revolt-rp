import { IForecast, IWeatherInfo, WorldSharedDateType } from '@revolt-rp/common';
import { weatherConfig } from './weather.config';
import { logger } from '../core/logger.config';
import { setWorldVariable } from './world.service';

const worldLogger = logger('world');

const weatherState: IWeatherInfo<RageEnums.Weather> = {
  currentWeather: RageEnums.Weather.EXTRA_SUNNY,
  temperature: 0,
  snowEnabled: false,
  interval: 0,
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


export function generateForecastEntry(): IForecast<RageEnums.Weather> {
  const season = getCurrentSeason();
  const { primary, secondary } = weatherConfig[season].weatherTypes;
  const { min, max } = weatherConfig[season].temperature;

  const weather = Math.random() < 0.7
    ? primary[Math.floor(Math.random() * primary.length)]
    : secondary[Math.floor(Math.random() * secondary.length)];

  const temperature = Math.floor(Math.random() * (max - min + 1) + min);

  return {
    weather,
    temperature,
    activeAt: new Date()
  };
}


export function generateForecast(): void {
  if (weatherState.interval === 0) {
    weatherState.interval = getRandomInterval();
  }

  const now = new Date();
  weatherState.forecast = [];

  for (let i = 0; i < 5; i++) {
    const forecastEntry = generateForecastEntry();

    forecastEntry.activeAt = new Date(now.getTime() + (weatherState.interval * i));

    weatherState.forecast.push(forecastEntry);
  }

  weatherState.currentWeather = weatherState.forecast[0].weather;
  weatherState.temperature = weatherState.forecast[0].temperature;

  syncWeather();

  worldLogger.log('info', `Generated new forecast. Next weather changes in ${Math.round(weatherState.interval / (60 * 1000))} minutes`);
}

export function syncWeather(): void {
  if (weatherState.frozen) return;

  mp.world.setWeatherTransition(weatherState.currentWeather, 30);

  setWorldVariable(WorldSharedDateType.EnableSnow, weatherState.snowEnabled);
  setWorldVariable(WorldSharedDateType.Temperature, weatherState.temperature);

  worldLogger.log('info', `Updated Weather: ${weatherState.currentWeather}, Temp: ${weatherState.temperature}°C`);
}

export function setWeatherCycle(): void {
  if (weatherState.forecast.length === 0) {
    generateForecast();
  }

  setInterval(() => {
    if (weatherState.frozen) return;

    const removedForecast = weatherState.forecast.shift();
    worldLogger.log('debug', `Weather changing from: ${removedForecast?.weather}, ${removedForecast?.temperature}°C`);

    const lastForecast = weatherState.forecast[weatherState.forecast.length - 1];
    const newForecast = generateForecastEntry();

    if (lastForecast && lastForecast.activeAt) {
      newForecast.activeAt = new Date(lastForecast.activeAt.getTime() + weatherState.interval);
    }

    weatherState.forecast.push(newForecast);

    weatherState.currentWeather = weatherState.forecast[0].weather;
    weatherState.temperature = weatherState.forecast[0].temperature;

    syncWeather();

    const forecastSummary = weatherState.forecast.map((f, i) => {
      const time = f.activeAt ? f.activeAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Unknown';
      return `${i === 0 ? '→' : ' '} ${time}: ${f.weather} ${f.temperature}°C`;
    }).join('\n');

    worldLogger.log('debug', `Weather forecast:\n${forecastSummary}`);

  }, weatherState.interval);

  worldLogger.log('info', `Weather cycle started with ${Math.round(weatherState.interval / (60 * 1000))} minute intervals`);
}

export function freezeWeather(freeze: boolean): void {
  weatherState.frozen = freeze;
  worldLogger.log('info', `Weather is now ${freeze ? 'frozen' : 'dynamic'}`);
}

export function getForecast(): IWeatherInfo<RageEnums.Weather> {
  return weatherState;
}

export const setWeather = (weather: RageEnums.Weather, frozen = true): void => {
  freezeWeather(frozen);
  weatherState.currentWeather = weather;
  mp.world.setWeatherTransition(weatherState.currentWeather, 30);

  worldLogger.log('info', `Weather manually set to ${weather}, frozen: ${frozen}`);
};

export const toggleSnow = (): boolean => {
  weatherState.snowEnabled = !weatherState.snowEnabled;
  setWorldVariable(WorldSharedDateType.EnableSnow, weatherState.snowEnabled);

  worldLogger.log('info', `Snow effects ${weatherState.snowEnabled ? 'enabled' : 'disabled'}`);
  return weatherState.snowEnabled;
};

export function initWeatherSystem(): void {
  generateForecast();
  setWeatherCycle();
  worldLogger.log('info', 'Weather system initialized');
}
