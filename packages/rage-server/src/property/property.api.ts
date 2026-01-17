import { on, ProcedureListenerInfo, register } from '@libertymp/rage-rpc';
import {
  GameUiKey, IEquipment,
  IPropertyCreate,
  IPropertyPoint,
  IPropertyUpdate,
  IPropertyVehicle, IPropertyVehicleCreate,
  ProcedureKey
} from '@revolt-rp/common';
import {
  createProperty,
  createPropertyPoint,
  createPropertyVehicle,
  deletePropertyPoint,
  deletePropertyVehicle,
  getAllProperties,
  getPropertiesByOwnerId,
  getPropertyById,
  getPropertyByPointId,
  getPropertyByVehicleId,
  initializeProperty,
  isPropertyOwner,
  playerLockProperty,
  playerTakeEquipment,
  propertyMainInteraction,
  propertyPointInteraction,
  updatePropertyPoint,
  updatePropertyVehicle
} from './property.service';
import { hidePlayerGameInterface } from '../player/util/player.util';


function loadAllPropertiesHandler() {
  getAllProperties()
    .then((properties) => properties.forEach(initializeProperty));
}

async function createPropertyHandler(propertyCreate: IPropertyCreate, { player }: ProcedureListenerInfo<PlayerMp>) {
  createProperty(player.position, player.dimension, propertyCreate)
    .then(() => {
      hidePlayerGameInterface(player, GameUiKey.CreateProperty);
    });
}


async function lockPropertyHandler(propertyId: string, { player }: ProcedureListenerInfo<PlayerMp>) {
  const property = await getPropertyById(propertyId);

  if (property)
    return playerLockProperty(player, property);
}

async function updatePropertyHandler(update: IPropertyUpdate, { player }: ProcedureListenerInfo<PlayerMp>) {
  const property = await getPropertyById(update.id);

  if (!property)
    return;

  if (!isPropertyOwner(property, player.character))
    return;

  if (update.name && update.name !== property.name) {
    property.name = update.name;
  }

  return property.save();
}


function propertyMainInteractionHandler(propertyId: string, { player }: ProcedureListenerInfo<PlayerMp>) {
  getPropertyById(propertyId)
    .then(property => propertyMainInteraction(player, property));
}

async function createPropertyPointHandler(propertyId: string, { player }: ProcedureListenerInfo<PlayerMp>) {
  return getPropertyById(propertyId)
    .then((property) => {
      const position = player.vehicle ? player.vehicle.position : player.position;
      const rotation = player.vehicle ? player.vehicle.rotation : new mp.Vector3(0, 0, player.heading);
      try {
        return createPropertyPoint(property, position, rotation, player.dimension);
      } catch (e) {
        console.log(e);
      }
    });
}

async function deletePropertyPointHandler(propertyPointId: string) {
  return getPropertyByPointId(propertyPointId)
    .then(property => deletePropertyPoint(property, propertyPointId));
}

async function updatePropertyPointHandler(pointUpdate: IPropertyPoint) {
  return getPropertyByPointId(pointUpdate.id)
    .then(property => updatePropertyPoint(property, pointUpdate));
}

async function createPropertyVehicleHandler(propertyVehicle: IPropertyVehicleCreate) {
  return getPropertyById(propertyVehicle.propertyId)
    .then(property => {
      return createPropertyVehicle(property, propertyVehicle);
    });
}

async function deletePropertyVehicleHandler(propertyVehicleId: string) {
  return getPropertyByVehicleId(propertyVehicleId)
    .then(property => deletePropertyVehicle(property, propertyVehicleId));
}

async function updatePropertyVehicleHandler(propertyVehicleUpdate: IPropertyVehicle) {
  return getPropertyByVehicleId(propertyVehicleUpdate.id)
    .then(property => updatePropertyVehicle(property, propertyVehicleUpdate));
}

function getPlayerPropertiesHandler(args: undefined, { player }: ProcedureListenerInfo<PlayerMp>) {
  return getPropertiesByOwnerId('Character', player.character.id);
}

function getAllPropertiesHandler() {
  return getAllProperties();
}

const propertyPointInteractionHandler = (propertyPointId: string, { player }: ProcedureListenerInfo<PlayerMp>) => {
  getPropertyByPointId(propertyPointId)
    .then(property => propertyPointInteraction(player, property, propertyPointId));
};

async function takePropertyEquipmentHandler(data: [string, IEquipment], { player }: ProcedureListenerInfo<PlayerMp>) {
  const [propertyId, equipment] = data;

  getPropertyById(propertyId)
    .then(property => playerTakeEquipment(player, property, equipment));
}

mp.events.add({
  packagesLoaded: loadAllPropertiesHandler
});

on(ProcedureKey.SERVER_PROPERTY_CREATE, createPropertyHandler);
on(ProcedureKey.SERVER_PROPERTY_MAIN_INTERACTION, propertyMainInteractionHandler);
on(ProcedureKey.SERVER_PROPERTY_POINT_INTERACTION, propertyPointInteractionHandler);
on(ProcedureKey.SERVER_PROPERTY_TAKE_EQUIPMENT, takePropertyEquipmentHandler);
register(ProcedureKey.SERVER_PROPERTY_LOCK, lockPropertyHandler);
register(ProcedureKey.SERVER_PROPERTY_UPDATE, updatePropertyHandler);
register(ProcedureKey.SERVER_CREATE_PROPERTY_POINT, createPropertyPointHandler);
register(ProcedureKey.SERVER_DELETE_PROPERTY_POINT, deletePropertyPointHandler);
register(ProcedureKey.SERVER_UPDATE_PROPERTY_POINT, updatePropertyPointHandler);
register(ProcedureKey.SERVER_CREATE_PROPERTY_VEHICLE, createPropertyVehicleHandler);
register(ProcedureKey.SERVER_DELETE_PROPERTY_VEHICLE, deletePropertyVehicleHandler);
register(ProcedureKey.SERVER_UPDATE_PROPERTY_VEHICLE, updatePropertyVehicleHandler);
register(ProcedureKey.SERVER_GET_PLAYER_PROPERTIES, getPlayerPropertiesHandler);
register(ProcedureKey.SERVER_GET_PROPERTIES, getAllPropertiesHandler);
