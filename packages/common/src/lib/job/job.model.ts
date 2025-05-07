import { ProcedureKey } from '../procedure.enums';
import { JobKey } from './job.enums';

export interface IWorkStartOptions {
  vehicle?: string;
}

export interface IWorkOptions {
  jobKey: JobKey;
  startedAt: Date;
}

export interface IJobOption {
  label: string;
  icon?: string;
  description?: string;
  eventKey: ProcedureKey;
}

export interface IBaseJob {
  key: JobKey;
  name: string;
  description: string;
  baseSalary: number;
}


