import { triggerClient } from '@libertymp/rage-rpc';
import { IPropertyCreate, ProcedureKey } from '@revolt-rp/common';
import { Property, PropertyModel } from './property.model';
import { propertyConfig } from './property.config';


export const getAllProperties = () => {
  return PropertyModel.find();
};

export const getPropertyById = (propertyId: string) => {
  return PropertyModel.findById(propertyId)
    .populate('owner.entity');
};

export const createProperty = async (position: Vector3, dimension: number, propertyCreate: IPropertyCreate) => {
  const property = await PropertyModel.create({
    position, dimension,
    ...propertyCreate
  });

  console.log('created property', property);

  initializeProperty(property);

  return property;
};


export const destroyProperty = async (propertyId: string) => {
  const property = await getPropertyById(propertyId);
  if (!property)
    return;

  if (property.colShape && mp.colshapes.exists(property.colShape))
    property.colShape.destroy();

  if (property.marker && mp.markers.exists(property.marker))
    property.marker?.destroy();

  return property.deleteOne();
};

export const initializeProperty = (property: Property) => {
  const colshape = mp.colshapes.newTube(property.position.x, property.position.y, property.position.z, 1.75, 1, property.dimension);

  colshape.onPlayerEnter = async (player) => {
    await playerShowPropertyInfo(player, property.id);
  };

  colshape.onPlayerExit = (player) => {
    triggerClient(player, ProcedureKey.CLIENT_TOGGLE_PROPERTY_INFO, null);
  };

  property.colShape = colshape;

  property.marker = mp.markers.new(RageEnums.Marker.VERTICAL_CYLINDER,
    new mp.Vector3(property.position.x, property.position.y, property.position.z - 1),
    propertyConfig.markerScale, {
      color: propertyConfig.markerColor,
      dimension: property.dimension,
      visible: true
    });
};


async function playerShowPropertyInfo(player: PlayerMp, propertyId: string) {
  const property = await getPropertyById(propertyId);
  if (!property)
    return;

  triggerClient(player, ProcedureKey.CLIENT_TOGGLE_PROPERTY_INFO, property);
}



