import { CommercialType, PropertyType } from '@revolt-rp/common';
import { Property } from './property.model';


export const resolvePropertyJob = async (property: Property) => {

  switch (property.type) {
    case PropertyType.Commercial:
      switch (property.subType) {
        case CommercialType.MechanicGarage:
          break;
      }
  }
}
