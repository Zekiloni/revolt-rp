import { getDistance } from '../util/vector.util';

const VEHICLE_CLASS_PREFIX = 'VEH_CLASS_';
export const INVALID_BONE_INDEX = 1;


export const isVehicleModelValid = (modelHash: number) => {
  return mp.game.streaming.isModelValid(modelHash) && mp.game.streaming.isModelAVehicle(modelHash);
};

export const getVehicleMaxSpeed = (modelHash: number) => {
  return mp.game.vehicle.getVehicleModelMaxSpeed(modelHash) * 3.6;
};


export const getVehicleClassName = (modelHash: number) => {
  const vehicleClassLabel = (VEHICLE_CLASS_PREFIX + mp.game.invoke(RageEnums.Natives.VEHICLE.GET_VEHICLE_CLASS_FROM_NAME, modelHash));
  return mp.game.ui.getLabelText(vehicleClassLabel);
};


export const getVehicleDisplayName = (modelHash: number) => {
  return mp.game.ui.getLabelText(mp.game.vehicle.getDisplayNameFromModel(modelHash));
};

export const getVehicleMaxNumberOfPassengers = (modelHash: number) => {
  return mp.game.vehicle.getVehicleModelMaxNumberOfPassengers(modelHash);
};


export const getVehicleAcceleration = (modelHash: number) => {
  return mp.game.vehicle.getVehicleModelAcceleration(modelHash);
};


export const getVehicleMaxBraking = (modelHash: number) => {
  return mp.game.vehicle.getVehicleModelMaxBraking(modelHash);
};


export const getVehicleModelMaxTraction = (modelHash: number) => {
  return mp.game.vehicle.getVehicleModelMaxTraction(modelHash);
};

export const isValidVehicleWindow = (vehicle: VehicleMp, index: number) => {
  if (!vehicle)
    return false;

  const WINDOW_BONE_NAMES = [
    'window_lf',
    'window_rf',
    'window_lr',
    'window_rr'
  ];

  return vehicle.getBoneIndexByName(WINDOW_BONE_NAMES[index]) != -INVALID_BONE_INDEX;
};

export const isNearTrunk = (vehicle: VehicleMp, radius = 1.55) => {
  const trunkBoneIndex = vehicle.getBoneIndexByName(RageEnums.Vehicle.Bones.BOOT);
  if (trunkBoneIndex === -1)
    return false;

  const trunkBonePosition = vehicle.getWorldPositionOfBone(trunkBoneIndex);
  return trunkBonePosition && getDistance(mp.players.local.position, trunkBonePosition) <= radius;
};


export const isNearHood = (vehicle: VehicleMp) => {
  const hoodBoneIndex = vehicle.getBoneIndexByName(RageEnums.Vehicle.Bones.BONNET);
  if (hoodBoneIndex === -1)
    return false;

  let hoodBonePosition = vehicle.getWorldPositionOfBone(hoodBoneIndex);
  if (hoodBonePosition) {
    hoodBonePosition = new mp.Vector3(
      hoodBonePosition.x + Math.cos(((vehicle.getHeading() + 90) * Math.PI) / 180) * 0.75,
      hoodBonePosition.y + Math.sin(((vehicle.getHeading() + 90) * Math.PI) / 180) * 0.75,
      hoodBonePosition.z
    );

    return hoodBonePosition && getDistance(mp.players.local.position, hoodBonePosition) <= 1.55;
  }

  return false;
};
