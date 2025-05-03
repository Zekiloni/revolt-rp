import { IBaseJob, IWorkStartOptions, JobKey } from '@revolt-rp/common';
import { Property } from '../property/property.model';
import { economyConfig } from '../economy/economy.config';
import { setPlayerJob } from '../player/character/character.service';

export abstract class BaseJob implements IBaseJob {
  key: JobKey;
  name: string;
  description: string;

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

  abstract startJob(player: PlayerMp, options: IWorkStartOptions): void;

  abstract stopJob(player: PlayerMp, completed: boolean): void;
}
