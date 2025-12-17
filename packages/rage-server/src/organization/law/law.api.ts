import { register } from '@libertymp/rage-rpc';
import { ProcedureKey } from '@revolt-rp/common';
import { trackPhoneNumber } from './law.service';

const trackPhoneNumberHandler = trackPhoneNumber;

register(ProcedureKey.SERVER_TRACK_PHONE_NUMBER, trackPhoneNumberHandler)
