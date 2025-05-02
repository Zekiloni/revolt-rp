import { IBaseJob, IJobStartOptions, JobKey } from '@revolt-rp/common';
import { Property } from '../property/property.model';
import { economyConfig } from '../economy/economy.config';

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
    player.character.job = {
      jobKey: this.key,
      property: property._id,
      salary: this.baseSalary,
      createdAt: new Date()
    };

    await player.character.save();
  };

  async quitJob(player: PlayerMp) {
    player.character.job = null;
    await player.character.save();
  }

  abstract startJob(player: PlayerMp, options: IJobStartOptions): void;

  abstract stopJob(player: PlayerMp, completed: boolean): void;
}
