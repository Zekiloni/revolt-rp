import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ProgressBarModule } from 'primeng/progressbar';
import { IDrivingQuestionAnswer, IDrivingQuiz, ProcedureKey } from '@revolt-rp/common';
import { RageClientService } from '../../../../../../domain/service/rage-client.service';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import { ButtonDirective } from 'primeng/button';
import { MeterGroupModule, MeterItem } from 'primeng/metergroup';


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

  constructor(private rageClientService: RageClientService) {
  }

  get currentQuestion() {
    return this.quiz?.questions[this.currentQuestionIdx];
  }

  get isCompleted() {
    return this.currentQuestionIdx >= this.quiz.maxQuestions;
  }

  ngOnInit() {
    this.quiz = {
      maxQuestions: 10,
      passingScore: 7,
      questions: [
        {
          question: 'What is the speed limit in a residential area?',
          answers: [
            { answer: '20 mph', correct: true },
            { answer: '30 mph' },
            { answer: '70 mph' }
          ]
        },
        {
          question: 'What is the speed limit in a residential area?',
          answers: [
            { answer: '20 mph', correct: true },
            { answer: '30 mph' },
            { answer: '50 mph' }
          ]
        },
        {
          question: 'What is the speed limit in a residential area?',
          answers: [
            { answer: '20 mph', correct: true },
            { answer: '30 mph' }
          ]
        },
        {
          question: 'What is the speed limit in a residential area?',
          answers: [
            { answer: '20 mph', correct: true },
            { answer: '30 mph' }
          ]
        },
        {
          question: 'What is the speed limit in a residential area?',
          answers: [
            { answer: '20 mph', correct: true },
            { answer: '30 mph' }
          ]
        },
        {
          question: 'What is the speed limit in a residential area?',
          answers: [
            { answer: '20 mph', correct: true },
            { answer: '30 mph' }
          ]
        },
        {
          question: 'What is the speed limit in a residential area?',
          answers: [
            { answer: '20 mph', correct: true },
            { answer: '30 mph' }
          ]
        },
        {
          question: 'What is the speed limit in a residential area?',
          answers: [
            { answer: '20 mph', correct: true },
            { answer: '30 mph' }
          ]
        },
        {
          question: 'What is the speed limit in a residential area?',
          answers: [
            { answer: '20 mph', correct: true },
            { answer: '30 mph' }
          ]
        },
        {
          question: 'What is the speed limit in a residential area?',
          answers: [
            { answer: '20 mph', correct: true },
            { answer: '30 mph' }
          ]
        },
        {
          question: 'What is the speed limit in a residential area?',
          answers: [
            { answer: '20 mph', correct: true },
            { answer: '30 mph' }
          ]
        }
      ]
    };

    if (this.currentQuestion)
      this.currentAnswers = this.shuffleAnswers(this.currentQuestion.answers);

    // this.rageClientService.callServer<IDrivingQuiz>(ProcedureKey.SERVER_GET_DRIVING_QUIZ)
    //   .subscribe({
    //     next: quiz => {
    //       this.quiz = quiz;
    //       if (this.currentQuestion)
    //         this.currentAnswers = this.shuffleAnswers(this.currentQuestion.answers);
    //     }
    //   });
  }

  shuffleAnswers(answers: IDrivingQuestionAnswer[]) {
    return answers.sort(() => Math.random() - 0.5);
  }

  nextQuestion() {
    if (!this.selectedAnswer) {
      return;
    }

    console.log(this.selectedAnswer);
    if (this.selectedAnswer.correct) {
      this.correctAnswers++;
    }

    this.selectedAnswer = null;
    this.currentQuestionIdx++;

    if (this.currentQuestion)
      this.currentAnswers = this.shuffleAnswers(this.currentQuestion.answers);

    if (this.isCompleted) {
      this.result = [
        { label: 'correct', value: Math.round((this.correctAnswers / this.quiz.maxQuestions) * 100), color: '#34d399' },
        {
          label: 'incorrect',
          value: Math.round(((this.quiz.maxQuestions - this.correctAnswers) / this.quiz.maxQuestions) * 100),
          color: '#d33434'
        }
      ];
    }
  }
}
