import { on, ProcedureListenerInfo } from '@libertymp/rage-rpc';
import { ProcedureKey } from '@revolt-rp/common';
import { getPropertyById } from '../property/property.service';
import { playerTakeJob, playerQuitJob, registerJob } from './base-job.service';
import { SanitationJob } from './sanitation-job.model';


function playerTakeJobHandler(propertyId: string, { player }: ProcedureListenerInfo<PlayerMp>) {
  getPropertyById(propertyId)
    .then(property => playerTakeJob(player, property));
}

function playerQuitJobHandler(propertyId: string, { player }: ProcedureListenerInfo<PlayerMp>) {
  getPropertyById(propertyId)
    .then(property => playerQuitJob(player, property));
}

(() => {
  const jobs = [new SanitationJob()];
  jobs.forEach(job => registerJob(job));
})();

on(ProcedureKey.SERVER_PLAYER_TAKE_JOB, playerTakeJobHandler);
on(ProcedureKey.SERVER_PLAYER_QUIT_JOB, playerQuitJobHandler);
