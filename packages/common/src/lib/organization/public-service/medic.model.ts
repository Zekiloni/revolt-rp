import { Ref } from '@typegoose/typegoose';
import { Base } from '@typegoose/typegoose/lib/defaultClasses';
import { ICharacter } from '../../player/character/character.model';

export enum MedicalRecordType {
  Injury = 'injury',
  Treatment = 'treatment',
  Death = 'death',
}

export interface IAnamnesis {
  chiefComplaint: string;
  historyOfPresentIllness?: string;
  pastMedicalHistory?: string;
  allergies?: string[];
  medications?: string[];
}

export interface IVitalSigns {
  heartRate?: number;
  bloodPressure?: { systolic: number; diastolic: number };
  respiratoryRate?: number;
  temperature?: number;
  oxygenSaturation?: number;
}

export interface ITreatment {
  treatmentType: string;
  description?: string;
  createdAt: Date;
}

export interface IMedicalRecord extends Base {
  patient: Ref<ICharacter>;
  medic: Ref<ICharacter>;
  recordType: MedicalRecordType;
  anamnesis?: IAnamnesis;
  vitals?: IVitalSigns;
  treatments?: ITreatment[];
  location?: string;
  createdAt: Date;
}
