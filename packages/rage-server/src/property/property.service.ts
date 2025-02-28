import { t } from 'i18next';
import { triggerClient } from '@libertymp/rage-rpc';
import {
  IPropertyCreate, IPropertyOwner,
  ProcedureKey,
  PropertyPointType,
  PropertySharedDataType,
  PropertyType
} from '@revolt-rp/common';
import { notifyPlayer } from '../player/util/player-notify.util';
import { Property, PropertyModel, PropertyOwner } from './property.model';
import { propertyConfig } from './property.config';
import { giveMoney } from '../player/character/character.service';


const notPurchasableTypes = [
  PropertyType.PublicService,
  PropertyType.Utility
];

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


export const destroyProperty = async (property: Property) => {
  const colShape = property.colShape;
  if (colShape && mp.colshapes.exists(colShape))
    colShape.destroy();

  const marker = property.marker;

  if (marker && mp.markers.exists(marker))
    marker?.destroy();

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

  colshape.setVariable(PropertySharedDataType.PropertyId, property.id);
  colshape.setVariable(PropertySharedDataType.InteractionType, PropertyPointType.Main);

  property.colShape = colshape;

  property.marker = mp.markers.new(RageEnums.Marker.VERTICAL_CYLINDER,
    new mp.Vector3(property.position.x, property.position.y, property.position.z - 1),
    propertyConfig.markerScale, {
      color: propertyConfig.markerColor,
      dimension: property.dimension,
      visible: true
    });
};


export const setPropertyOwner = async (property: Property, owner: PropertyOwner) => {
  property.owner = owner;
  await property.save();
};

export const getPropertyByColShape = async (colShape: ColshapeMp, type: PropertyPointType) => {
  const propertyId = colShape.getVariable(PropertySharedDataType.PropertyId);
  const pointType = colShape.getVariable(PropertySharedDataType.InteractionType);

  if (!propertyId || pointType !== type)
    return null;

  return getPropertyById(propertyId);
};


export const getClosesProperty = (position: Vector3, dimension: number, pointType: PropertyPointType) => {
  const colShapes = mp.colshapes.getClosestInDimension(position, dimension, 1);

  if (colShapes.length) {
    const [closestColShape] = colShapes;

    if (closestColShape && closestColShape.isPointWithin(position)) {
      return getPropertyByColShape(closestColShape, pointType);
    }
  }

  return null;
}

async function playerShowPropertyInfo(player: PlayerMp, propertyId: string) {
  const property = await getPropertyById(propertyId);
  if (!property)
    return;

  triggerClient(player, ProcedureKey.CLIENT_TOGGLE_PROPERTY_INFO, property);
}


export async function playerBuyProperty(player: PlayerMp, property: Property) {
  if (notPurchasableTypes.includes(property.type))
    return notifyPlayer(player, { severity: 'error', summary: t('error'), detail: t('property_not_for_sale') });

  if (!property.forSale || property.owner)
    return notifyPlayer(player, { severity: 'error', summary: t('error'), detail: t('property_not_for_sale') });

  if (player.character.cash < property.price)
    return notifyPlayer(player, { severity: 'error', summary: t('error'), detail: t('not_enough_money') });

  await giveMoney(player, -property.price);

  const propertyOwner = new PropertyOwner();
  propertyOwner.type = 'Character';
  propertyOwner.entity = player.character._id;

  await setPropertyOwner(property, propertyOwner);

  notifyPlayer(player, { severity: 'success', summary: t('success'), detail: t('property_purchased') });
}

