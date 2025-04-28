import { JobKey } from './job.enums';

export interface IJobStartOptions {
  vehicle?: string;
}


export interface IBaseJob {
  key: JobKey;
  name: string;
  description: string;
  baseSalary: number;
}


