import { on, ProcedureListenerInfo } from '@libertymp/rage-rpc';
import { ProcedureKey } from '@revolt-rp/common';
import { collectGarbage, deliverGarbage, loadGarbage } from './sanitation-job.service';

function collectGarbageHandler(objectHandle: number, { player }: ProcedureListenerInfo<PlayerMp>) {
  collectGarbage(player, objectHandle);
}

async function loadGarbageHandler(vehicle: VehicleMp, { player }: ProcedureListenerInfo<PlayerMp>) {
  await loadGarbage(player, vehicle);
}

async function deliverGarbageHandler(args: undefined, { player }: ProcedureListenerInfo<PlayerMp>) {
  await deliverGarbage(player, player.vehicle);
}

on(ProcedureKey.SERVER_PLAYER_COLLECT_GARBAGE, collectGarbageHandler);
on(ProcedureKey.SERVER_PLAYER_LOAD_GARBAGE, loadGarbageHandler);
on(ProcedureKey.SERVER_PLAYER_DELIVER_GARBAGE, deliverGarbageHandler);
