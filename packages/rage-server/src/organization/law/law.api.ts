import { register } from '@libertymp/rage-rpc';
import { catchError, ProcedureKey } from '@revolt-rp/common';
import { trackPhoneNumber } from './law.service';

const trackPhoneNumberHandler = async (phoneNumber: string) =>
  trackPhoneNumber(phoneNumber)
    .then(position => position)
    .catch(catchError);

register(ProcedureKey.SERVER_TRACK_PHONE_NUMBER, trackPhoneNumberHandler);
