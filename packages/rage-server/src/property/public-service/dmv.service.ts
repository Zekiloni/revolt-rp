import { IDrivingQuiz } from '@revolt-rp/common';
import { Property } from '../property.model';
import { dmvConfig } from './dmv.config';


export const getDrivingQuiz = (): IDrivingQuiz => {
  const quiz = dmvConfig.quiz;

  const shuffledQuestions = quiz.questions.sort(() => 0.5 - Math.random());
  const selectedQuestions = shuffledQuestions.slice(0, quiz.maxQuestions);

  return {
    ...quiz,
    questions: selectedQuestions
  };
}

export function openDmvMenu(player: PlayerMp, property: Property) {

}
