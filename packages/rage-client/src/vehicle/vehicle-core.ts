import { on, ProcedureListenerInfo } from '@libertymp/rage-rpc';


on('clientPlayerEnterVehicle', playerEnterVehicle);

function playerEnterVehicle(args: unknown, info: ProcedureListenerInfo) {
   throw new Error('Function not implemented.');
}
