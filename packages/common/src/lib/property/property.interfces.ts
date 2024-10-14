import { ObjectId } from 'mongoose';
import { BusinessType, PropertyType } from './property.enums';
import { Vector3 } from '../core.interface';

export interface Property {
   id: string;
   name?: string;
   owner?: string | ObjectId;
   type: PropertyType;
   subType?: BusinessType;
   price?: number;
   position: Vector3;
   workers: ObjectId[] | string[];
   products: ObjectId[] | string[];
}
