
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
