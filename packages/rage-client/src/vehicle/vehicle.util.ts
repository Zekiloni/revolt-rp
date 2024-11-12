const VEHICLE_CLASS_PREFIX = 'VEH_CLASS_';

export const isVehicleModelValid = (modelHash: number) => {
  return mp.game.streaming.isModelValid(modelHash);
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
