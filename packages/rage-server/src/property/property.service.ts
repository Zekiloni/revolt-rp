import { IPropertyCreate } from '@revolt-rp/common';
import { PropertyModel } from './property.model';


export const createProperty = (position: Vector3, dimension: number, propertyCreate: IPropertyCreate) => {
  return PropertyModel.create({
    position, dimension,
    ...propertyCreate
  });
};
