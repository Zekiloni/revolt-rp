import { NgOptimizedImage } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Ripple } from 'primeng/ripple';
import { ChipsModule } from 'primeng/chips';
import { ButtonDirective } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { RageClientService } from '../../domain/service/rage-client.service';
import { ProcedureKey } from '@bcrp-rage/common';

enum AuthOption {
  LOGIN,
  REGISTER
}

type AuthForm = {
  username: FormControl<string | null>;
  password: FormControl<string | null>;
  emailAddress?: FormControl<string | null>;
}

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CheckboxModule,
    ButtonDirective,
    Ripple,
    ChipsModule,
    NgOptimizedImage,
    ReactiveFormsModule
  ],
  providers: [RageClientService],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent implements OnInit, OnDestroy {
  protected readonly AuthOption = AuthOption;

  selectedAuthOption: AuthOption = AuthOption.REGISTER;
  authForm: FormGroup<AuthForm>;

  get ctaLabel() {
    return this.selectedAuthOption == AuthOption.LOGIN ? 'Sign up' : 'Sing in';
  }

  constructor(private formBuilder: FormBuilder,
              private rageClientService: RageClientService) {
    this.authForm = this.buildAuthForm();
  }

  private buildAuthForm() {
    const controls: Partial<AuthForm> = {
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    };

    if (this.selectedAuthOption === AuthOption.REGISTER) {
      controls.emailAddress = new FormControl('', [Validators.required, Validators.email]);
    }

    return this.formBuilder.group(controls) as FormGroup<AuthForm>;
  }

  private handleUsernameSuggestion = (usernameSuggestion: string) => {
    this.selectedAuthOption = AuthOption.LOGIN;
    this.authForm.controls.username.setValue(usernameSuggestion);
  };

  ngOnDestroy() {
    this.rageClientService.off(
      ProcedureKey.BROWSER_AUTH_SUGGEST,
      this.handleUsernameSuggestion
    );
  }

  ngOnInit() {
    this.rageClientService.on(
      ProcedureKey.BROWSER_AUTH_SUGGEST,
      this.handleUsernameSuggestion
    );
  }

  switchAuthOptions() {
    this.selectedAuthOption = this.selectedAuthOption === AuthOption.LOGIN ?
      AuthOption.REGISTER : AuthOption.LOGIN;

    this.authForm = this.buildAuthForm();
  }

  submitAuthForm() {
    if (this.authForm && this.authForm.invalid) {
      return;
    }

    console.log(this.authForm);

    const procedureKey = this.selectedAuthOption === AuthOption.LOGIN
      ? ProcedureKey.SERVER_PLAYER_AUTHORIZE : ProcedureKey.SERVER_PLAYER_CREATE_ACCOUNT;

    const payload = this.authForm.getRawValue();

    this.rageClientService.callServer(procedureKey, payload);
  }
}
