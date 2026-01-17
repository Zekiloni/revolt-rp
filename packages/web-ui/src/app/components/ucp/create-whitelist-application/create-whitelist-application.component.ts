import { Component, Inject } from '@angular/core';
import { WhitelistService } from '../../../core/service/whitelist.service';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IWhiteListCreate, IWhitelistTest } from '@revolt-rp/common';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Button } from 'primeng/button';
import { Textarea } from 'primeng/textarea';
import { Listbox } from 'primeng/listbox';
import { DisableCopyDirective } from '../../../core/util/disable-copy.directive';
import { Store } from '@ngrx/store';
import { IAuthorizationState } from '../../../core/store/auth/auth.state';

@Component({
  selector: 'app-create-whitelist-application',
  standalone: true,
  imports: [
    Button,
    ReactiveFormsModule,
    Textarea,
    Listbox,
    DisableCopyDirective
  ],
  providers: [WhitelistService],
  templateUrl: './create-whitelist-application.component.html',
  styleUrl: './create-whitelist-application.component.css'
})
export class CreateWhitelistApplicationComponent {
  form!: FormGroup;
  whitelistTest: IWhitelistTest | null = null;

  constructor(
    @Inject(Store) private store: Store<IAuthorizationState>,
    private formBuilder: FormBuilder,
    private dialogRef: DynamicDialogRef,
    private whitelistService: WhitelistService
  ) {
    this.loadWhitelistTest();
  }

  get questionsArray(): FormArray {
    return this.form.get('answers') as FormArray;
  }

  get essaysArray(): FormArray {
    return this.form.get('essayAnswers') as FormArray;
  }

  private createQuestionFormGroup(essayQuestion: string) {
    return this.formBuilder.group({
      question: [essayQuestion],
      answer: ['', [Validators.required]]
    });
  }


  loadWhitelistTest() {
    this.form = this.formBuilder.group({
      answers: this.formBuilder.array([]),
      essayAnswers: this.formBuilder.array([])
    });

    this.whitelistService.generateWhitelist()
      .subscribe({
        next: (whitelistTest) => {
          this.whitelistTest = whitelistTest;
          this.whitelistTest.questions.forEach(q => {
            const group = this.createQuestionFormGroup(q.question);
            (this.form.get('answers') as FormArray).push(group);
          });

          this.whitelistTest.essayQuestions.forEach((essayQuestion) => {
            const group = this.createQuestionFormGroup(essayQuestion);
            (this.form.get('essayAnswers') as FormArray).push(group);
          });
        }
      });
  }

  cancel() {
    this.dialogRef.close();
  }

  submit() {
    const rawValue = this.form.getRawValue() as IWhiteListCreate;
    this.whitelistService.createWhitelist(rawValue)
      .subscribe({ next: () => this.dialogRef.close(true) });
  }
}
