import { Ref } from '@typegoose/typegoose';
import { Base } from '@typegoose/typegoose/lib/defaultClasses';
import { ICharacter } from '../../player/character/character.model';

export enum FireIncidentType {
  Fire = 'fire',
  Rescue = 'rescue',
  Hazmat = 'hazmat',
}

export interface IFireIncident extends Base {
  responder: Ref<ICharacter>;
  incidentType: FireIncidentType;
  location?: string;
  description?: string;
  createdAt: Date;
}
