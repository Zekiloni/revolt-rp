import { triggerClient } from '@libertymp/rage-rpc';
import { ProcedureKey } from '@revolt-rp/common';
import { Property } from '../property.model';


export const openClothingStore = async (player: PlayerMp, property: Property) => {
  triggerClient(player, ProcedureKey.CLIENT_TOGGLE_CLOTHING_STORE, property);
};
