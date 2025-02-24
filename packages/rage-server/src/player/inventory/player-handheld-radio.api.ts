import { IHandheldRadioConfig, ItemType, ProcedureKey } from '@revolt-rp/common';
import { on, ProcedureListenerInfo } from '@libertymp/rage-rpc';
import { getPlayerSelectedItem } from './player-inventory.service';
import { updateHandheldRadio } from './player-handheld-radio.service';


async function updateHandheldRadioHandler(radioConfig: IHandheldRadioConfig, { player }: ProcedureListenerInfo<PlayerMp>) {
  const selectedItem = getPlayerSelectedItem(player);

  if (selectedItem) {
    const itemData = selectedItem.data;

    if (itemData.type.includes(ItemType.DEVICE_HANDHELD_RADIO)) {
      return updateHandheldRadio(selectedItem, radioConfig);
    }
  }
}

on(ProcedureKey.SERVER_HANDHELD_RADIO_UPDATE, updateHandheldRadioHandler);
