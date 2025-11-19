import { on } from '@libertymp/rage-rpc';
import { AddictionType, ProcedureKey } from '@revolt-rp/common';




function playerDrugUseHandler(data: [AddictionType, number, number]) {
  const [addictionType, effectLevel, duration] = data;

  switch (addictionType) {
    case AddictionType.Cannabis:
      return;
  }
  // Here you can implement the logic to handle the drug use effect on the client side.
}


on(ProcedureKey.CLIENT_DRUG_USE_EFFECT, playerDrugUseHandler)
