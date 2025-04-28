import { IJobStartOptions, JobKey } from '@revolt-rp/common';
import { Property } from '../property/property.model';
import { BaseJob } from './base-job.model';


export class SanitationJob extends BaseJob {

  constructor() {
    super(JobKey.Sanitation, 'Sanitation', 'Sanitation Job', 100);
  }

  async takeJob(player: PlayerMp, property: Property) {
  }

  quitJob(player: PlayerMp): void {
    throw new Error('Method not implemented.');
  }

  startJob(player: PlayerMp, options: IJobStartOptions): void {
    throw new Error('Method not implemented.');
  }

  stopJob(player: PlayerMp, completed: boolean): void {
    throw new Error('Method not implemented.');
  }

}
