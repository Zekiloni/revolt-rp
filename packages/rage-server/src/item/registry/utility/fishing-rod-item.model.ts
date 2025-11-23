import { callClient } from '@libertymp/rage-rpc';
import {
  IUsableItem,
  ItemType,
  PlayerAttachmentTypeEnum,
  PlayerSharedDataType,
  ProcedureKey
} from '@revolt-rp/common';
import { BaseItem, Item } from '@revolt-rp/core';
import { playerAddAttachment, playerRemoveAttachment } from '../../../player/util/player-attachment.util';
import { playerRemoveItemFromInventory } from '../../../player/inventory/player-inventory.service';
import { notifyPlayer } from '../../../player/util/player-notify.util';
import { t } from 'i18next';

export class FishingRodItem extends BaseItem implements IUsableItem<PlayerMp, Item> {

  constructor(name: string, description: string, model: string, weight: number) {
    super(name, description, model, [ItemType.UTILITY, ItemType.MISCELLANEOUS, ItemType.FISHING_ROD], weight);
  }

  select(player: PlayerMp, item: Item): void {
    playerAddAttachment(player, PlayerAttachmentTypeEnum.HoldFishingRod01);
    player.setVariable(PlayerSharedDataType.ClickToUse, true);
  }

  deselect(player: PlayerMp, item: Item) {
    playerRemoveAttachment(player, PlayerAttachmentTypeEnum.HoldFishingRod01);
    player.setVariable(PlayerSharedDataType.ClickToUse, false);
  }

  async use(player: PlayerMp, item: Item) {
    const isFishingActive = player.getVariable<boolean>(PlayerSharedDataType.IsFishing) ?? false;

    console.log('FishingRodItem use called, isFishingActive:', isFishingActive);
    if (isFishingActive) {
      return;
    }


    const baitItem = player.character.inventory.find((invItem: Item) => invItem.data.isFishingBait) as Item | undefined;

    if (!baitItem)
      return notifyPlayer(player, { severity: 'error', detail: t('you_dont_have_item', { item: t('items.fishing_bait') }) });

    console.log('Bait item found:', baitItem);
    const fishingStarted = await callClient<boolean>(player, ProcedureKey.CLIENT_USE_FISHING_ROD);

    console.log('Fishing started:', fishingStarted);
    if (!fishingStarted)
      return;


    console.log('Setting IsFishing to true');
    player.setVariable(PlayerSharedDataType.IsFishing, true);
    baitItem.usage = (baitItem.usage ?? 100) - 10;

    if (baitItem.usage <= 0) {
      await playerRemoveItemFromInventory(player, baitItem.id);
    } else {
      await baitItem.save();
    }

    item.usage = (item.usage ?? 100) - 1;

    if (item.usage <= 0) {
      await playerRemoveItemFromInventory(player, item.id);
      return;
    } else {
      await item.save();
    }

    console.log('FishingRodItem use completed');
  }
}
