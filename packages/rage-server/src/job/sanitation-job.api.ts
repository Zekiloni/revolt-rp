import { on, ProcedureListenerInfo } from '@libertymp/rage-rpc';
import { ProcedureKey } from '@revolt-rp/common';
import { collectGarbage, loadGarbage } from './sanitation-job.service';

function collectGarbageHandler(objectHandle: number, { player }: ProcedureListenerInfo<PlayerMp>) {
  collectGarbage(player, objectHandle);
}

function loadGarbageHandler(vehicle: VehicleMp, { player }: ProcedureListenerInfo<PlayerMp>) {
  loadGarbage(player, vehicle);
}

on(ProcedureKey.SERVER_PLAYER_COLLECT_GARBAGE, collectGarbageHandler);
on(ProcedureKey.SERVER_PLAYER_LOAD_GARBAGE, loadGarbageHandler)
