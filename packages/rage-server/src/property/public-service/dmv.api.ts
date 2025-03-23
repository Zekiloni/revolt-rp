import { on } from '@libertymp/rage-rpc';
import { ProcedureKey } from '@revolt-rp/common';
import { getDrivingQuiz } from './dmv.service';


function getDrivingQuizHandler() {
  return getDrivingQuiz();
}

on(ProcedureKey.SERVER_GET_DRIVING_QUIZ, getDrivingQuizHandler);
