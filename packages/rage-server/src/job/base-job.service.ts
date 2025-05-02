import { GameUiKey, IJobOption, JobKey, ProcedureKey } from '@revolt-rp/common';
import { Property } from '../property/property.model';
import { BaseJob } from './base-job.model';
import { showPlayerGameInterface } from '../player/util/player.util';
import { triggerBrowsers } from '@libertymp/rage-rpc';

type JobMenuActionItem = {
  isSupported: (player: PlayerMp, property: Property) => boolean;
  action: IJobOption;
}


const jobRegistry: Map<JobKey, BaseJob> = new Map();

const jobActions: JobMenuActionItem[] = [
  {
    isSupported: (player, property) => {
      return !player.character.job;
    },
    action: {
      label: 'take_job',
      icon: 'pi pi-briefcase',
      eventKey: ProcedureKey.SERVER_PLAYER_TAKE_JOB
    }
  },
  {
    isSupported: (player, property) => {
      return player.character.job && property._id === player.character.job.property;
    },
    action: {
      label: 'quit_job',
      icon: 'pi pi-sign-out',
      eventKey: ProcedureKey.SERVER_PLAYER_QUIT_JOB
    }
  }
];

export const registerJob = (job: BaseJob) => {
  if (jobRegistry.has(job.key)) {
    throw new Error(`Job with key ${job.key} is already registered.`);
  }

  jobRegistry.set(job.key, job);
};

export const getJob = (key: JobKey): BaseJob | undefined => {
  return jobRegistry.get(key);
};

export const getAllJobs = (): BaseJob[] => {
  return Array.from(jobRegistry.values());
};


export const openJobMenu = (player: PlayerMp, property: Property) => {
  const job = property.job;

  if (!job) {
    return;
  }

  const menu = jobActions
    .filter((action) => action.isSupported(player, property));

  showPlayerGameInterface(player, GameUiKey.JobMenu, () => {
    triggerBrowsers(player, ProcedureKey.BROWSER_SET_JOB_MENU, menu);
  });
};
