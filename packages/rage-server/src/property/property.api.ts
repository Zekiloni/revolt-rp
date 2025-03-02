import { on, ProcedureListenerInfo, register } from '@libertymp/rage-rpc';
import { GameUiKey, IPropertyCreate, IPropertyUpdate, ProcedureKey } from '@revolt-rp/common';
import {
  createProperty,
  getAllProperties,
  getPropertyById,
  initializeProperty,
  playerLockProperty
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

  return property.updateOne(update);
}

mp.events.add({
  packagesLoaded: loadAllPropertiesHandler
});

on(ProcedureKey.SERVER_PROPERTY_CREATE, createPropertyHandler);
register(ProcedureKey.SERVER_PROPERTY_LOCK, lockPropertyHandler);
register(ProcedureKey.SERVER_PROPERTY_UPDATE, updatePropertyHandler);
