import { IJobStartOptions, JobKey } from '@revolt-rp/common';
import { BaseJob } from './base-job.model';


export class SanitationJob extends BaseJob {

  constructor() {
    super(JobKey.Sanitation, 'Sanitation', 'Sanitation Job');
  }

  startJob(player: PlayerMp, options: IJobStartOptions): void {
    throw new Error('Method not implemented.');
  }

  stopJob(player: PlayerMp, completed: boolean): void {
    throw new Error('Method not implemented.');
  }
}
