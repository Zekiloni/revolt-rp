import { on, ProcedureListenerInfo } from '@libertymp/rage-rpc';
import { ProcedureKey } from '@revolt-rp/common';
import { getPropertyById } from '../property/property.service';
import { playerTakeJob, playerQuitJob, registerJob, playerStartJob, playerStopJob } from './base-job.service';
import { SanitationJob } from './sanitation-job.model';


function playerTakeJobHandler(propertyId: string, { player }: ProcedureListenerInfo<PlayerMp>) {
  console.log('playerTakeJobHandler', propertyId, player);
  getPropertyById(propertyId)
    .then(property => playerTakeJob(player, property));
}

function playerQuitJobHandler(propertyId: string, { player }: ProcedureListenerInfo<PlayerMp>) {
  getPropertyById(propertyId)
    .then(property => playerQuitJob(player, property));
}

function playerStartJobHandler(propertyId: string, { player }: ProcedureListenerInfo<PlayerMp>) {
  getPropertyById(propertyId)
    .then(property => playerStartJob(player, property));
}

function playerStopJobHandler(propertyId: string, { player }: ProcedureListenerInfo<PlayerMp>) {
  getPropertyById(propertyId)
    .then(property => playerStopJob(player, property));
}

(() => {
  const jobs = [new SanitationJob()];
  jobs.forEach(job => registerJob(job));
})();

on(ProcedureKey.SERVER_PLAYER_TAKE_JOB, playerTakeJobHandler);
on(ProcedureKey.SERVER_PLAYER_QUIT_JOB, playerQuitJobHandler);
on(ProcedureKey.SERVER_PLAYER_START_JOB, playerStartJobHandler);
on(ProcedureKey.SERVER_PLAYER_STOP_JOB, playerStopJobHandler);
