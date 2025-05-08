import { t } from 'i18next';
import { triggerBrowsers } from '@libertymp/rage-rpc';
import { GameUiKey, IJobOption, JobKey, ProcedureKey } from '@revolt-rp/common';
import { showPlayerGameInterface } from '../player/util/player.util';
import { notifyPlayer } from '../player/util/player-notify.util';
import { Property } from '../property/property.model';
import { BaseJob } from './base-job.model';
import { Types } from 'mongoose';


type JobMenuActionItem = {
  isSupported: (player: PlayerMp, property: Property) => boolean;
  action: IJobOption;
}


const jobRegistry: Map<JobKey, BaseJob> = new Map();

const jobMenuOptions: JobMenuActionItem[] = [
  {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isSupported: (player, _property) => {
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
      return player.character.job && property._id.equals((<Types.ObjectId>player.character.job.property));
    },
    action: {
      label: 'quit_job',
      icon: 'pi pi-sign-out',
      eventKey: ProcedureKey.SERVER_PLAYER_QUIT_JOB
    }
  },
  {
    isSupported: (player, property) => {
      return true;
    },
    action: {
      label: 'start_job',
      icon: 'pi pi-play-circle',
      eventKey: ProcedureKey.SERVER_PLAYER_START_JOB
    }
  },
  {
    isSupported: (player, property) => {
      return true;
    },
    action: {
      label: 'stop_job',
      icon: 'pi pi-stop-circle',
      eventKey: ProcedureKey.SERVER_PLAYER_STOP_JOB
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


export const playerTakeJob = async (player: PlayerMp, property: Property) => {
  console.log('playerTakeJob', property);
  const job = property.job;

  if (!job) {
    return;
  }

  console.log('playerTakeJob', job);
  await job.takeJob(player, property);
  notifyPlayer(player, { severity: 'info', summary: t('you_took_job', { job: t(job.name) }) });
};

export const playerQuitJob = async (player: PlayerMp, property: Property) => {
  const job = property.job;

  if (!job) {
    return;
  }

  job.stopJob(player, false);
  await job.quitJob(player);

  notifyPlayer(player, { severity: 'info', summary: t('you_quit_job', { job: t(job.name) }) });
};

export const playerStartJob = async (player: PlayerMp, property: Property) => {
  const job = property.job;

  if (!job) {
    return;
  }

  job.startJob(player, property, {});
};

export const playerStopJob = async (player: PlayerMp, property: Property) => {
  const job = property.job;

  if (!job) {
    return;
  }

  // TODO: Add job completion logic
  job.stopJob(player, false);
};

export const openJobMenu = (player: PlayerMp, property: Property) => {
  const job = property.job;

  if (!job) {
    return;
  }

  const menu = jobMenuOptions
    .filter((option) => option.isSupported(player, property))
    .map(option => option.action);

  showPlayerGameInterface(player, GameUiKey.JobMenu, () => {
    triggerBrowsers(player, ProcedureKey.BROWSER_SET_PROPERTY_ID, property.id);
    triggerBrowsers(player, ProcedureKey.BROWSER_SET_JOB_MENU, menu);
  });
};
