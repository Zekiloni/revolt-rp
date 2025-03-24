
export const enum DrivingTestMistakeType {
  Speeding = 'speeding',
  OffRoadDriving = 'off_road_driving',
  Collision = 'collision',
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
