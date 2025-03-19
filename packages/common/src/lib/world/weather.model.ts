
export interface IForecast<T> {
  weather: T;
  temperature: number;
  activeAt: Date;
}

export interface IWeatherInfo<T> {
  currentWeather: T;
  temperature: number,
  frozen: boolean,
  interval: number;
  snowEnabled: boolean;
  forecast: IForecast<T>[]
}

