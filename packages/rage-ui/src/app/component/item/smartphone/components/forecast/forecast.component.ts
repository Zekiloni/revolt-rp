import { Observable, of } from 'rxjs';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IForecast, IWeatherInfo, ProcedureKey } from '@revolt-rp/common';
import { RageClientService } from '../../../../../domain/service/rage-client.service';
import dayjs from 'dayjs';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-forecast',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './forecast.component.html',
  styleUrl: './forecast.component.css'
})
export class ForecastComponent {
  $weather!: Observable<IWeatherInfo<string>>;

  constructor(private rageClientService: RageClientService) {
    this.getForecast();
  }

  private getForecast(): void {
    // this.$weather = of({
    //   currentWeather: 'CLEAR',
    //   temperature: 21,
    //   frozen: false,
    //   interval: 4700000,
    //   snowEnabled: false,
    //   forecast: [
    //     {
    //       weather: 'CLEAR',
    //       temperature: 17
    //     },
    //     {
    //       weather: 'RAIN',
    //       temperature: 16
    //     },
    //     {
    //       weather: 'CLEAR',
    //       temperature: 5
    //     }
    //   ]
    // });
    this.$weather = this.rageClientService.callServer<IWeatherInfo<string>>(ProcedureKey.SERVER_GET_FORECAST);
  }

  getMinTemperature(forecast: IForecast<string>[]): number {
    return Math.min(...forecast.map(f => f.temperature));
  }

  getMaxTemperature(forecast: IForecast<string>[]): number {
    return Math.max(...forecast.map(f => f.temperature));
  }


  getWeatherIcon(weather: string): string {
    switch (weather) {
      case 'BLIZZARD':
        return 'pi pi-cloud-snow text-blue-200';
      case 'CLEAR':
        return 'pi pi-sun text-yellow-500';
      case 'CLEARING':
        return 'pi pi-cloud-sun text-yellow-400';
      case 'CLOUDS':
        return 'pi pi-cloud text-gray-400';
      case 'EXTRASUNNY':
        return 'pi pi-sun text-yellow-600';
      case 'FOGGY':
        return 'pi pi-cloud text-gray-300';
      case 'OVERCAST':
        return 'pi pi-cloud text-gray-500';
      case 'RAIN':
        return 'pi pi-cloud text-blue-500';
      case 'SMOG':
        return 'pi pi-cloud text-amber-700';
      case 'SNOWLIGHT':
        return 'pi pi-cloud text-blue-100';
      case 'THUNDER':
        return 'pi pi-bolt text-purple-500';
      case 'XMAS':
        return 'pi pi-cloud text-red-500';
      default:
        return 'pi pi-cloud text-gray-400';
    }
  }

  getTemperatureColor(temperature: number): string {
    if (temperature < 0) {
      return 'text-blue-200';
    } else if (temperature < 10) {
      return 'text-blue-400';
    } else if (temperature < 20) {
      return 'text-blue-500';
    } else if (temperature < 30) {
      return 'text-blue-600';
    } else {
      return 'text-blue-700';
    }
  }
}
