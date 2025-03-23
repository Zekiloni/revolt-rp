import { t } from 'i18next';
import { Types } from 'mongoose';
import { triggerClient } from '@libertymp/rage-rpc';
import {
  IPropertyCreate,
  ProcedureKey,
  PropertyPointType,
  PropertySharedDataType,
  PropertyType, PublicServiceType, purchasablePropertyTypes
} from '@revolt-rp/common';
import { notifyPlayer, sendInfoMessage } from '../player/util/player-notify.util';
import { getPlayerOrganizationId, giveMoney } from '../player/character/character.service';
import { Property, PropertyModel, PropertyOwner } from './property.model';
import { Character } from '../player/character/character.model';
import { propertyConfig } from './property.config';
import { openDmvMenu } from './public-service/dmv.service';


const propertyMenuHandlers = {
  [PropertyType.PublicService]: {
    [PublicServiceType.DMV]: openDmvMenu
  }
};

export const getAllProperties = () => {
  return PropertyModel.find();
};

export const getPropertyById = (propertyId: string) => {
  return PropertyModel.findById(propertyId)
    .populate('owner.entity');
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
