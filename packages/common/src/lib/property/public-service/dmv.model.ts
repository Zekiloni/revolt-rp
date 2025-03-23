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
