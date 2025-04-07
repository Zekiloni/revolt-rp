import { t } from 'i18next';
import { ICommandValidator, IVehicle } from '@revolt-rp/common';
import { customAlphabet } from 'nanoid';


export const createDefaultVehicleInfo = (options: Partial<IVehicle>, model: string, position: Vector3, vehicle: VehicleMp, isTemporary: boolean) => {
  const info: Partial<IVehicle> = {
    ...options,
    model,
    position,
    rotation: vehicle.rotation,
    dimension: vehicle.dimension,
    engine: false,
    isTemporary: isTemporary,
    color: [[0, 0, 0], [0, 0, 0]],
    pearlescentColor: 0,
    dashboardColor: 0,
    trimColor: 0,
    mods: [],
    wheelColor: 0,
    trunk: [],
    windowTint: 1,
    neonColor: 0,
    engineHealth: 1000.0,
    bodyHealth: 1000.0,
    liveryId: -1,
    wheelType: -1,
    fuel: 100.0,
    locked: false,
    mileage: 0.00,
    extras: [],
    createdAt: new Date()
  };
  return info;
};


export const isPlayerInVehicleCommandValidator: ICommandValidator<PlayerMp> = {
  validate: (player) => player.vehicle !== undefined,
  message: t('not_in_vehicle')
};


export const isAnyVehicleOnPosition = (position: Vector3, range: number) => {
  const closestVehicles = mp.vehicles.getClosest(new mp.Vector3(position.x, position.y, position.z), 1);
  return closestVehicles.length ? closestVehicles[0].dist(position) < range : false;
};


export const generateNumberPlate = (length: number) => {
  const generate = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', length);
  return generate();
}
