import { on, ProcedureListenerInfo } from '@libertymp/rage-rpc';
import { GameUiKey, IPropertyCreate, ProcedureKey } from '@revolt-rp/common';
import { createProperty, getAllProperties, initializeProperty } from './property.service';
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


mp.events.add({
  packagesLoaded: loadAllPropertiesHandler
});

on(ProcedureKey.SERVER_PROPERTY_CREATE, createPropertyHandler);
