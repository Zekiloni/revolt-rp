import { IPayment } from '../commercial.model';

export const enum DrivingTestMistakeType {
  Speeding = 'dmv_speeding',
  OffRoadDriving = 'dmv_off_road_driving',
  Collision = 'dmv_collision',
}


export interface IDrivingQuestionAnswer {
  answer: string;
  correct?: true;
}

export interface IDrivingQuestion {
  question: string;
  answers: IDrivingQuestionAnswer[];
}

export interface IDrivingQuiz {
  questions: IDrivingQuestion[];
  maxQuestions: number;
  passingScore: number;
}

export interface IRegisterVehicle {
  vehicleId: string;
  type: 'register' | 'renew';
  payment: IPayment;
  propertyId: string;
}
