import { register } from '@libertymp/rage-rpc';
import { ProcedureKey } from '@revolt-rp/common';
import { getForecast, initWeatherSystem } from './weather.service';


function getForecastHandler() {
  return getForecast();
}


(() => {
  initWeatherSystem();
})();

register(ProcedureKey.SERVER_GET_FORECAST, getForecastHandler);
