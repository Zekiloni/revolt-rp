import './node';
import { Account } from '@bcrp-rage/common';

declare global {

  interface PlayerMp {
    account: Account;
  }

  interface VehicleMp {

  }

}
