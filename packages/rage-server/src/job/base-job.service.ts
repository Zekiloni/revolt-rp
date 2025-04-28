import { JobKey } from '@revolt-rp/common';
import { BaseJob } from './base-job.model';

const jobRegistry: Map<JobKey, BaseJob> = new Map();

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
