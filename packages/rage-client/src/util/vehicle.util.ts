export const isVehicleModelValid = (modelHash: number) => {
  return mp.game.streaming.isModelValid(modelHash);
};

/**
 * Return vehicle model max speed, convert to kmh
 *
 * @return {*}
 */
export const getVehicleMaxSpeed = (modelHash: number): number => {
  return mp.game.vehicle.getVehicleModelMaxSpeed(modelHash);
};


export const getVehicleClassName = (modelHash: number) => {
  const vehicleClassLabel = (`VEH_CLASS_${mp.game.invoke(RageEnums.Natives.VEHICLE.GET_VEHICLE_CLASS_FROM_NAME, modelHash)}`);
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
