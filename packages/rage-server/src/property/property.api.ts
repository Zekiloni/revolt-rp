import { on, ProcedureListenerInfo } from '@libertymp/rage-rpc';
import { IPropertyCreate, ProcedureKey } from '@revolt-rp/common';
import { createProperty } from './property.service';

async function createPropertyHandler(propertyCreate: IPropertyCreate, { player }: ProcedureListenerInfo<PlayerMp>) {
  await createProperty(player.position, player.dimension, propertyCreate);
}

on(ProcedureKey.SERVER_PROPERTY_CREATE, createPropertyHandler);
