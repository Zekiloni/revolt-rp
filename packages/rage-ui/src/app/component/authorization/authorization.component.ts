import { NgOptimizedImage } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Ripple } from 'primeng/ripple';
import { ChipsModule } from 'primeng/chips';
import { ButtonDirective } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { RageClientService } from '../../domain/service/rage-client.service';
import { ApiError, IAccount, ProcedureKey } from '@bcrp-rage/common';
import { environment } from '../../../environments/environment';
import { AutoFocus } from 'primeng/autofocus';
import { MessageService } from 'primeng/api';


type AuthForm = {
  username: FormControl<string | null>;
  password: FormControl<string | null>;
  emailAddress?: FormControl<string | null>;
}

@Component({
  selector: 'app-authorization',
  standalone: true,
  imports: [
    CheckboxModule,
    ButtonDirective,
    Ripple,
    ChipsModule,
    NgOptimizedImage,
    ReactiveFormsModule,
    AutoFocus
  ],
  providers: [RageClientService],
  templateUrl: './authorization.component.html',
  styleUrl: './authorization.component.css'
})
export class AuthorizationComponent implements OnInit, OnDestroy {
  WEBSITE_URL = environment.WEBSITE_URL;
  authForm: FormGroup<AuthForm>;

  constructor(private formBuilder: FormBuilder,
              private rageClientService: RageClientService,
              private messageService: MessageService) {
    this.authForm = this.buildAuthForm();
  }

  private buildAuthForm() {
    const controls: Partial<AuthForm> = {
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    };

    return this.formBuilder.group(controls) as FormGroup<AuthForm>;
  }

  private handleUsernameSuggestion = (usernameSuggestion: string) => {
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


  submitAuthForm() {
    if (this.authForm && this.authForm.invalid) {
      return;
    }

    const payload = this.authForm.getRawValue();

    this.rageClientService.callServer<IAccount>(ProcedureKey.SERVER_PLAYER_AUTHORIZE, payload)
      .subscribe({ next: this.handleSuccessfulAuth, error: this.handleAuthError });
  }

  private handleSuccessfulAuth = (account: IAccount) => {
    console.log('account', JSON.stringify(account));
  };

  private handleAuthError = (error: ApiError) => {
    this.messageService.add({ severity: 'error', detail: error.message });
  };
}
