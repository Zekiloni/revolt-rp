import { t } from 'i18next';
import { Types } from 'mongoose';
import { triggerClient } from '@libertymp/rage-rpc';
import {
  CommercialType,
  IPropertyCreate,
  IPropertyPoint,
  IPropertyVehicle,
  IPropertyVehicleCreate,
  ProcedureKey, propertyJobMap,
  PropertyPointType,
  PropertySharedDataType,
  PropertyType,
  PublicServiceType,
  purchasablePropertyTypes,
  UtilityType
} from '@revolt-rp/common';
import {
  Character,
  Property,
  propertyConfig,
  PropertyModel,
  PropertyOwner,
  PropertyPoint,
  PropertyVehicle
} from '@revolt-rp/core';
import { notifyPlayer, sendInfoMessage } from '../player/util/player-notify.util';
import { getPlayerOrganizationId, giveMoney } from '../player/character/character.service';
import { openDmvMenu } from './public-service/dmv.service';
import { openBankMenu } from '../banking/banking.service';
import { isAnyVehicleOnPosition } from '../vehicle/vehicle.util';
import { toggleVehicleRentMenu } from './commercial/vehicle-rent.service';
import { toggleGroceryStoreMenu } from './commercial/grocery-store.service';
import { toggleClothingStoreMenu } from './commercial/clothing-store.service';
import { toggleVehicleDealershipMenu } from './commercial/vehicle-dealership.service';
import { getJob, openJobMenu } from '../job/base-job.service';
import { toggleGarageMenu } from './garage/garage.service';


const propertyMenuHandlers = {
  [PropertyType.PublicService]: {
    [PublicServiceType.DMV]: openDmvMenu,
    [PublicServiceType.Bank]: openBankMenu
  },
  [PropertyType.Commercial]: {
    [CommercialType.GroceryStore]: toggleGroceryStoreMenu,
    [CommercialType.ClothingStore]: toggleClothingStoreMenu,
    [CommercialType.VehicleRent]: toggleVehicleRentMenu,
    [CommercialType.VehicleDealership]: toggleVehicleDealershipMenu
  },
  [PropertyType.Garage]: toggleGarageMenu,
  [PropertyType.Utility]: {
    [UtilityType.RecyclingCenter]: openJobMenu
  }
};

const propertyPointHandlers = {
  [PropertyPointType.EquipmentPoint]: (player: PlayerMp, property: Property) => {
    return equipmentPointInteraction(player, property);
  }
};

const visiblePropertyPointTypes = [
  PropertyPointType.MenuPoint,
  PropertyPointType.DeliveryPoint,
  PropertyPointType.EquipmentPoint
];

export const getAllProperties = () => {
  return PropertyModel.find();
};

export const getPropertyById = async (propertyId: string) => {
  return PropertyModel.findById(propertyId)
    .populate('owner.entity')
    .populate('parentProperty');
};


export const getPropertiesByOwnerId = async (type: 'Character' | 'Organization', ownerId: string) => {
  return PropertyModel.find({ 'owner.type': type, 'owner.entity': ownerId }).exec();
};

export const getPropertyByPointId = async (pointId: string) => {
  return PropertyModel.findOne({ 'points.id': pointId }).exec();
};

export const getPropertyMarker = (property: Property) => {
  return mp.markers.toArray().find(marker => marker.getVariable(PropertySharedDataType.PropertyId) === property.id);
};

export const getPropertyColShape = (property: Property) => {
  return mp.colshapes.toArray().find(colShape => colShape.getVariable(PropertySharedDataType.PropertyId) === property.id);
};


export const setPropertyMarker = (property: Property, marker: MarkerMp) => {
  marker.setVariable(PropertySharedDataType.PropertyId, property.id);
};

export const setPropertyPointMarker = (propertyPoint: PropertyPoint, marker: MarkerMp) => {
  marker.setVariable(PropertySharedDataType.InteractionPointId, propertyPoint.id);
  marker.setVariable(PropertySharedDataType.InteractionType, propertyPoint.type);
};


export const getPropertyPointMarker = (propertyPoint: PropertyPoint) => {
  return mp.markers.toArray().find(marker =>
    marker.getVariable(PropertySharedDataType.InteractionPointId) === propertyPoint.id);
};

export const setPropertyPointColShape = (propertyPoint: PropertyPoint, colShape: ColshapeMp) => {
  colShape.setVariable(PropertySharedDataType.InteractionPointId, propertyPoint.id);
  colShape.setVariable(PropertySharedDataType.InteractionType, propertyPoint.type);
};

export const getPropertyPointColShape = (propertyPoint: PropertyPoint) => {
  return mp.colshapes.toArray().find(colShape =>
    colShape.getVariable(PropertySharedDataType.InteractionPointId) === propertyPoint.id);
};

export const setPropertyColShape = (property: Property, colShape: ColshapeMp) => {
  colShape.setVariable(PropertySharedDataType.PropertyId, property.id);
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
  const point = new PropertyPoint({
    id: new Types.ObjectId().toString(),
    position, rotation, dimension, type
  });

  const colShape = mp.colshapes.newTube(position.x, position.y, position.z, 1.75, 1, dimension);
  setPropertyPointColShape(point, colShape);

  colShape.onPlayerEnter = (player) => {
    const handler = propertyPointHandlers[point.type];
    if (handler && typeof handler === 'function') {
      handler(player, property);
    }
  }

  if (visiblePropertyPointTypes.includes(type)) {
    setPropertyPointMarker(point, createPropertyMarker(property));
  }

  property.points.push(point);
  await property.save();

  return point;
};


export const getPropertyJob = (property: Property) => {
  const jobKey = propertyJobMap[property.subType];
  return jobKey ? getJob(jobKey) : undefined;
}

export const deletePropertyPoint = async (property: Property, pointId: string) => {
  const point = property.points.find((point) => point.id === pointId);

  if (!point)
    return false;

  const colshape = getPropertyPointColShape(point);
  if (colshape && mp.colshapes.exists(colshape))
    colshape.destroy();

  const marker = getPropertyPointMarker(point);
  if (marker && mp.markers.exists(marker))
    marker.destroy();


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
  const colShape = getPropertyColShape(property);

  mp.players.forEachInRange(property.position, 2.0, (player) => {
    if (colShape.isPointWithin(player.position))
      triggerClient(player, ProcedureKey.CLIENT_TOGGLE_PROPERTY_INFO, null);
  });

  if (colShape && mp.colshapes.exists(colShape))
    colShape.destroy();

  const marker = getPropertyMarker(property);

  if (marker && mp.markers.exists(marker))
    marker?.destroy();

  property.points.forEach(point => deletePropertyPoint(property, point.id));

  return property.deleteOne();
};

function createPropertyMarker(property: Property) {
  return mp.markers.new(RageEnums.Marker.VERTICAL_CYLINDER,
    new mp.Vector3(property.position.x, property.position.y, property.position.z - 1),
    propertyConfig.markerScale, {
      color: propertyConfig.markerColor,
      dimension: property.dimension,
      visible: true
    });
}

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

  setPropertyColShape(property, colshape);
  setPropertyMarker(property, createPropertyMarker(property));

  property.points.forEach((point) => {
    const propertyPointColshape = mp.colshapes.newTube(point.position.x, point.position.y, point.position.z, 1.75, 1, point.dimension);
    setPropertyPointColShape(point, propertyPointColshape);

    propertyPointColshape.onPlayerEnter = (player) => {
      const handler = propertyPointHandlers[point.type];
      if (handler && typeof handler === 'function') {
        handler(player, property);
      }
    }

    if (visiblePropertyPointTypes.includes(point.type)) {
      const markerMp = mp.markers.new(RageEnums.Marker.VERTICAL_CYLINDER,
        new mp.Vector3(point.position.x, point.position.y, point.position.z - 1),
        propertyConfig.markerScale, {
          color: propertyConfig.markerColor,
          dimension: point.dimension,
          visible: true
        });

      setPropertyPointMarker(point, markerMp);
    }
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
  const menuHandler = propertyMenuHandlers[property.type]?.[property.subType] || propertyMenuHandlers[property.type];

  if (menuHandler && typeof menuHandler === 'function') {
    return menuHandler(player, property);
  }
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

export const createPropertyVehicle = async (property: Property, propertyVehicle: IPropertyVehicleCreate) => {
  const vehicle: PropertyVehicle = {
    id: new Types.ObjectId().toString(),
    limit: propertyVehicle.limit,
    model: propertyVehicle.model,
    color: propertyVehicle.color
  };

  property.vehicles.push(vehicle);
  await property.save();
  return vehicle;
};

export const deletePropertyVehicle = async (property: Property, propertyVehicleId: string) => {
  property.vehicles = property.vehicles.filter((vehicle) => vehicle.id !== propertyVehicleId);
  await property.save();
  return property.vehicles;
};

export const updatePropertyVehicle = async (property: Property, update: IPropertyVehicle) => {
  const vehicle = property.vehicles.find((vehicle) => vehicle.id === update.id);

  if (!vehicle)
    return;

  Object.assign(vehicle, update);
  await property.save();
  return vehicle;
};

export const getPropertyByVehicleId = async (vehicleId: string) => {
  return PropertyModel.findOne({ 'vehicles.id': vehicleId }).exec();
};

function equipmentPointInteraction(player: PlayerMp, property: Property) {
  // TODO: open equipment menu

}
