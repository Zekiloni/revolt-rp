import { IBaseJob, IJobStartOptions, JobKey } from '@revolt-rp/common';
import { Property } from '../property/property.model';

export abstract class BaseJob implements IBaseJob {
  key: JobKey;
  name: string;
  description: string;
  baseSalary: number;

  protected constructor(
    key: JobKey,
    name: string,
    description: string,
    baseSalary: number
  ) {
    this.key = key;
    this.name = name;
    this.description = description;
    this.baseSalary = baseSalary;
  }

  abstract takeJob(player: PlayerMp, property: Property): void;

  abstract quitJob(player: PlayerMp): void;

  abstract startJob(player: PlayerMp, options: IJobStartOptions): void;

  abstract stopJob(player: PlayerMp, completed: boolean): void;
}
