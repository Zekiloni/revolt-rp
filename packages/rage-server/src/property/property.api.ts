import { on, ProcedureListenerInfo } from '@libertymp/rage-rpc';
import { IPropertyCreate, ProcedureKey } from '@revolt-rp/common';
import { createProperty, getAllProperties, initializeProperty } from './property.service';


function loadAllPropertiesHandler() {
  getAllProperties()
    .then((properties) => properties.forEach(initializeProperty))
}

async function createPropertyHandler(propertyCreate: IPropertyCreate, { player }: ProcedureListenerInfo<PlayerMp>) {
  await createProperty(player.position, player.dimension, propertyCreate);
}


mp.events.add({
  packagesLoaded: loadAllPropertiesHandler
})

on(ProcedureKey.SERVER_PROPERTY_CREATE, createPropertyHandler);
