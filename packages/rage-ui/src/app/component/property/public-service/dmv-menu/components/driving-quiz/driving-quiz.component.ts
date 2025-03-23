import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MeterGroupModule, MeterItem } from 'primeng/metergroup';
import { ProgressBarModule } from 'primeng/progressbar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonDirective } from 'primeng/button';
import { IDrivingQuestionAnswer, IDrivingQuiz, ProcedureKey } from '@revolt-rp/common';
import { RageClientService } from '../../../../../../domain/service/rage-client.service';


@Component({
  selector: 'app-driving-quiz',
  standalone: true,
  imports: [CommonModule, TranslatePipe, ProgressBarModule, RadioButtonModule, FormsModule, ButtonDirective, MeterGroupModule],
  templateUrl: './driving-quiz.component.html',
  styleUrl: './driving-quiz.component.css'
})
export class DrivingQuizComponent implements OnInit {
  quiz!: IDrivingQuiz;

  selectedAnswer: IDrivingQuestionAnswer | null = null;
  currentQuestionIdx = 0;
  correctAnswers = 0;
  currentAnswers: IDrivingQuestionAnswer[] = [];
  result: MeterItem[] | undefined;

  constructor(private rageClientService: RageClientService, private translateService: TranslateService) {
  }

  get currentQuestion() {
    return this.quiz?.questions[this.currentQuestionIdx];
  }

  get isCompleted() {
    return this.currentQuestionIdx >= this.quiz.maxQuestions;
  }

  get isPassed() {
    return this.correctAnswers >= this.quiz.passingScore;
  }

  private shuffleAnswers(answers: IDrivingQuestionAnswer[]) {
    return answers.sort(() => Math.random() - 0.5);
  }

  private completeQuiz() {
    this.result = [
      {
        label: this.translateService.instant('correct_answers'),
        value: Math.round((this.correctAnswers / this.quiz.maxQuestions) * 100),
        color: getComputedStyle(document.documentElement).getPropertyValue('--green-500')
      },
      {
        label: this.translateService.instant('incorrect_answers'),
        value: Math.round(((this.quiz.maxQuestions - this.correctAnswers) / this.quiz.maxQuestions) * 100),
        color: getComputedStyle(document.documentElement).getPropertyValue('--red-500')
      }
    ];

    if (this.isPassed)
      this.rageClientService.triggerServer(ProcedureKey.SERVER_START_DRIVING_TEST);
  }

  nextQuestion() {
    if (!this.selectedAnswer) {
      return;
    }

    if (this.selectedAnswer.correct) {
      this.correctAnswers++;
    }

    this.selectedAnswer = null;
    this.currentQuestionIdx++;

    if (this.currentQuestion)
      this.currentAnswers = this.shuffleAnswers(this.currentQuestion.answers);

    if (this.isCompleted) {
      this.completeQuiz();
    }
  }

  ngOnInit() {
    this.rageClientService.callServer<IDrivingQuiz>(ProcedureKey.SERVER_GET_DRIVING_QUIZ)
      .subscribe({
        next: quiz => {
          this.quiz = quiz;
          if (this.currentQuestion)
            this.currentAnswers = this.shuffleAnswers(this.currentQuestion.answers);
        }
      });
  }
}
