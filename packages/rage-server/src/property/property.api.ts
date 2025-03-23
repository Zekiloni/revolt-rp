import { on, ProcedureListenerInfo, register } from '@libertymp/rage-rpc';
import { GameUiKey, IPropertyCreate, IPropertyPoint, IPropertyUpdate, ProcedureKey } from '@revolt-rp/common';
import {
  createProperty, createPropertyPoint, deletePropertyPoint,
  getAllProperties,
  getPropertyById, getPropertyByPointId,
  initializeProperty, isPropertyOwner,
  playerLockProperty, propertyMainInteraction, updatePropertyPoint
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
    .then(property => {
      const position = player.vehicle ? player.vehicle.position : player.position;
      const rotation = player.vehicle ? player.vehicle.rotation : new mp.Vector3(0, 0, player.heading);
      return createPropertyPoint(property, position, rotation, player.dimension);
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


mp.events.add({
  packagesLoaded: loadAllPropertiesHandler
});

on(ProcedureKey.SERVER_PROPERTY_CREATE, createPropertyHandler);
on(ProcedureKey.SERVER_PROPERTY_MAIN_INTERACTION, propertyMainInteractionHandler);
register(ProcedureKey.SERVER_PROPERTY_LOCK, lockPropertyHandler);
register(ProcedureKey.SERVER_PROPERTY_UPDATE, updatePropertyHandler);
register(ProcedureKey.SERVER_CREATE_PROPERTY_POINT, createPropertyPointHandler);
register(ProcedureKey.SERVER_DELETE_PROPERTY_POINT, deletePropertyPointHandler);
register(ProcedureKey.SERVER_UPDATE_PROPERTY_POINT, updatePropertyPointHandler);
