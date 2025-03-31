import { t } from 'i18next';
import { Types } from 'mongoose';
import { triggerClient } from '@libertymp/rage-rpc';
import {
  CommercialType,
  IPropertyCreate, IPropertyPoint,
  ProcedureKey,
  PropertyPointType,
  PropertySharedDataType,
  PropertyType,
  PublicServiceType,
  purchasablePropertyTypes
} from '@revolt-rp/common';
import { notifyPlayer, sendInfoMessage } from '../player/util/player-notify.util';
import { getPlayerOrganizationId, giveMoney } from '../player/character/character.service';
import { Property, PropertyModel, PropertyOwner, PropertyPoint } from './property.model';
import { Character } from '../player/character/character.model';
import { propertyConfig } from './property.config';
import { openDmvMenu } from './public-service/dmv.service';
import { openBankMenu } from '../banking/banking.service';
import { isAnyVehicleOnPosition } from '../vehicle/vehicle.util';
import { openRentMenu } from './commercial/vehicle-rent.service';
import { openGroceryStoreMenu } from './commercial/grocery-store.service';
import { openClothingStore } from './commercial/clothing-store.service';


const propertyMenuHandlers = {
  [PropertyType.PublicService]: {
    [PublicServiceType.DMV]: openDmvMenu,
    [PublicServiceType.Bank]: openBankMenu
  },
  [PropertyType.Commercial]: {
    [CommercialType.GroceryStore]: openGroceryStoreMenu,
    [CommercialType.ClothingStore]: openClothingStore,
    [CommercialType.VehicleRent]: openRentMenu
  }
};

export const getAllProperties = () => {
  return PropertyModel.find();
};

export const getPropertyById = async (propertyId: string) => {
  return PropertyModel.findById(propertyId)
    .populate('owner.entity');
};

export const getPropertyByPointId = async (pointId: string) => {
  return PropertyModel.findOne({ 'points.id': pointId }).exec();
};

export const isPropertyOwner = (property: Property, character: Character) => {
  return property.owner?.type === 'Character' && (<Types.ObjectId>property.owner.entity).equals(character._id);
};

export const createProperty = async (position: Vector3, dimension: number, propertyCreate: IPropertyCreate) => {
  const property = await PropertyModel.create({
    position, dimension,
    ...propertyCreate
  });


  initializeProperty(property);

  return property;
};


export const createPropertyPoint = async (property: Property, position: Vector3, rotation: Vector3, dimension: number, type: PropertyPointType = PropertyPointType.MainPoint) => {
  const point: PropertyPoint = {
    id: new Types.ObjectId().toString(),
    position, rotation, dimension, type
  };

  property.points.push(point);
  await property.save();
  return point;
};


export const deletePropertyPoint = async (property: Property, pointId: string) => {
  property.points = property.points.filter((point) => point.id !== pointId);
  await property.save();
  return true;
};

export const updatePropertyPoint = async (property: Property, update: IPropertyPoint) => {
  const point = property.points.find((point) => point.id === update.id);

  if (!point)
    return;

  Object.assign(point, update);
  await property.save();
  return point;
};

export const destroyProperty = async (property: Property) => {
  const colShape = property.colShape;

  mp.players.forEachInRange(property.position, 2.0, (player) => {
    if (colShape.isPointWithin(player.position))
      triggerClient(player, ProcedureKey.CLIENT_TOGGLE_PROPERTY_INFO, null);
  });

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
  colshape.setVariable(PropertySharedDataType.InteractionType, PropertyPointType.MainPoint);

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


export const getPropertyAvailableParkingSpot = (property: Property) => {
  return property.points
    .filter((spot) => spot.type === PropertyPointType.ParkingSpot)
    .find(spot => !isAnyVehicleOnPosition(spot.position as Vector3, 3.0));
};


export const getClosestProperty = (position: Vector3, dimension: number, pointType: PropertyPointType) => {
  const colShapes = mp.colshapes.getClosestInDimension(position, dimension, 15);

  if (colShapes.length) {
    // TODO: Workaround because RAGE:MP doesn't have a method to get closest colshape that is actually working
    const closestColShape = colShapes
      .filter((colShape) => colShape.getVariable(PropertySharedDataType.InteractionType) === pointType)
      .find((colShape) => colShape.isPointWithin(position));

    if (closestColShape) {
      return getPropertyByColShape(closestColShape, pointType);
    }
  }

  return null;
};

export const getPropertyByName = async (name: string) => {
  return PropertyModel.findOne({
    name: { $regex: new RegExp(name, 'i') }
  }).exec();
};

async function playerShowPropertyInfo(player: PlayerMp, propertyId: string) {
  const property = await getPropertyById(propertyId);
  if (!property)
    return;

  triggerClient(player, ProcedureKey.CLIENT_TOGGLE_PROPERTY_INFO, property);
}


export async function playerBuyProperty(player: PlayerMp, property: Property) {
  if (!purchasablePropertyTypes.includes(property.type))
    return notifyPlayer(player, { severity: 'error', summary: t('error'), detail: t('property_not_for_sale') });

  if (!property.forSale && property.owner)
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

export async function playerLockProperty(player: PlayerMp, property: Property) {
  if (!purchasablePropertyTypes.includes(property.type))
    return;

  if (!property.owner)
    return notifyPlayer(player, { severity: 'error', summary: t('error'), detail: t('property_not_owned') });

  switch (property.owner.type) {
    case 'Character': {
      if (!(<Types.ObjectId>property.owner.entity).equals((player.character.id)))
        return notifyPlayer(player, { severity: 'error', summary: t('error'), detail: t('you_dont_have_keys') });
      break;
    }

    case 'Organization': {
      if (!(<Types.ObjectId>property.owner.entity).equals(getPlayerOrganizationId(player)))
        return notifyPlayer(player, { severity: 'error', summary: t('error'), detail: t('you_dont_have_keys') });
      break;
    }
  }

  property.locked = !property.locked;
  await property.save();

  sendInfoMessage(player, t('property_locked', { locked: property.locked ? t('closed') : t('opened') }));

  return property.locked;
}


export const propertyMainInteraction = (player: PlayerMp, property: Property) => {
  if (!property.interiorPosition)
    return propertyMenuInteraction(player, property);

  // TODO: enter interior
};

function propertyMenuInteraction(player: PlayerMp, property: Property) {
  const menuHandler = propertyMenuHandlers[property.type]?.[property.subType];

  if (menuHandler)
    return menuHandler(player, property);
}


export const fillPropertyStock = async (property: Property, quantity: number) => {
  if (!property.catalog)
    return;

  property.catalog.forEach(product => {
    product.stock = (product.stock || 0) + quantity;
  });

  property.markModified('catalog');
  await property.save();
};
