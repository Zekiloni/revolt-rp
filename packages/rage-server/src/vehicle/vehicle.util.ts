import { t } from 'i18next';
import { ICommandValidator, IVehicle } from '@revolt-rp/common';


export const createDefaultVehicleInfo = (options: Partial<IVehicle>, model: string, position: Vector3, vehicle: VehicleMp) => {
  const info: IVehicle = {
    ...options,
    model,
    position,
    rotation: vehicle.rotation,
    dimension: vehicle.dimension,
    engine: false,
    isTemporary: true,
    color: [[0, 0, 0], [0, 0, 0]],
    pearlescentColor: 0,
    dashboardColor: 0,
    trimColor: 0,
    mods: [],
    wheelColor: 0,
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
