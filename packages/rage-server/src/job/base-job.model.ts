import {
  IBaseJob,
  IClothingComponent,
  IWorkStartOptions,
  JobKey
} from '@revolt-rp/common';
import { Property } from '../property/property.model';
import { economyConfig } from '../economy/economy.config';
import { setPlayerJob } from '../player/character/character.service';
import { setPlayerBestTorso } from '../item/registry/clothing/clothing.util';
import { loadPlayerClothing } from '../player/inventory/player-clothing.service';

export abstract class BaseJob implements IBaseJob {
  key: JobKey;
  name: string;
  description: string;

  clothing?: Record<RageEnums.Hashes.Ped.MP_M_FREEMODE_01 | RageEnums.Hashes.Ped.MP_F_FREEMODE_01, IClothingComponent[]>;

  protected constructor(
    key: JobKey,
    name: string,
    description: string
  ) {
    this.key = key;
    this.name = name;
    this.description = description;
  }

  get baseSalary() {
    return economyConfig.jobs[this.key].baseSalary;
  }

  async takeJob(player: PlayerMp, property: Property) {
    await setPlayerJob(player, property);
  };

  async quitJob(player: PlayerMp) {
    await setPlayerJob(player, null);
  }

  abstract startJob(player: PlayerMp, property: Property, options: IWorkStartOptions): void;

  abstract stopJob(player: PlayerMp, completed: boolean): void;

  equip(player: PlayerMp): void {
    if (!this.clothing) {
      return;
    }

    const components: IClothingComponent[] = this.clothing[player.model];
    components.forEach(component => {
      player.setClothes(component.componentId, component.drawable, component.texture, component.palette);

      if (component.componentId === RageEnums.ClothesComponent.AUXILIARY) {
        setPlayerBestTorso(player);
      }
    });
  }

  unequip(player: PlayerMp): void {
    loadPlayerClothing(player);
  }
}
