import { GameUiKey, IDrivingQuiz, ProcedureKey } from '@revolt-rp/common';
import { Property } from '../property.model';
import { dmvConfig } from './dmv.config';
import { triggerClient } from '@libertymp/rage-rpc';


export const getDrivingQuiz = (): IDrivingQuiz => {
  const quiz = dmvConfig.quiz;

  const shuffledQuestions = quiz.questions.sort(() => 0.5 - Math.random());
  const selectedQuestions = shuffledQuestions.slice(0, quiz.maxQuestions);

  return {
    ...quiz,
    questions: selectedQuestions
  };
};

export function openDmvMenu(player: PlayerMp, property: Property) {
  triggerClient(player, ProcedureKey.CLIENT_PLAYER_SHOW_INTERFACE, GameUiKey.DmvMenu);
}
