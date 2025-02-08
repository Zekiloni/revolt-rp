
export interface IForecast<T> {
  weather: T;
  temperature: number;
}

export interface IWeatherInfo<T> {
  currentWeather: T;
  temperature: number,
  frozen: boolean,
  forecast: IForecast<T>[]
}

