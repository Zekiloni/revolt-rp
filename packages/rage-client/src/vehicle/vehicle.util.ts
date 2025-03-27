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
