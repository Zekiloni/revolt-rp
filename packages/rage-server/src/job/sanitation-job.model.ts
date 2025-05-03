import { IWorkOptions, IWorkStartOptions, JobKey, PlayerSharedDataType } from '@revolt-rp/common';
import { BaseJob } from './base-job.model';
import { Property } from '../property/property.model';


export class SanitationJob extends BaseJob {

  constructor() {
    super(JobKey.Sanitation, 'sanitation', 'sanitation_job_description');
  }

  startJob(player: PlayerMp, property: Property, options: IWorkStartOptions): void {
    const work : IWorkOptions = {
      startedAt: new Date(),
    }

    player.setVariable(PlayerSharedDataType.Work, work);
  }

  stopJob(player: PlayerMp, completed: boolean): void {
    player.setVariable(PlayerSharedDataType.Work, null);
  }
}
