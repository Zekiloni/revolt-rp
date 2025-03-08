import { NgOptimizedImage } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Ripple } from 'primeng/ripple';
import { ChipsModule } from 'primeng/chips';
import { ButtonDirective } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { RageClientService } from '../../domain/service/rage-client.service';
import { ApiError, IAccount, ProcedureKey } from '@revolt-rp/common';
import { environment } from '../../../environments/environment';
import { AutoFocus } from 'primeng/autofocus';
import { MessageService } from 'primeng/api';
import { CharacterSelectorComponent } from '../character-selector';
import { TranslatePipe } from '@ngx-translate/core';
import { fadeInOutTrigger } from '../../domain/util/animation.util';
import { StaticAssetPipe } from '../../domain/pipe/static-asset.pipe';


type AuthForm = {
  username: FormControl<string | null>;
  password: FormControl<string | null>;
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
    AutoFocus,
    CharacterSelectorComponent,
    FormsModule,
    TranslatePipe,
    StaticAssetPipe
  ],
  templateUrl: './authorization.component.html',
  styleUrl: './authorization.component.css',
  animations: [fadeInOutTrigger]
})
export class AuthorizationComponent implements OnInit, OnDestroy {
  SERVER_NAME = environment.SERVER_NAME;
  WEBSITE_URL = environment.WEBSITE_URL;
  authForm: FormGroup<AuthForm>;
  authLoading = false;
  rememberMe = false;

  account: IAccount | null = null;

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
      ProcedureKey.BROWSER_AUTHORIZATION_REMEMBER,
      this.handleUsernameSuggestion
    );
  }

  ngOnInit() {
    this.rageClientService.on(
      ProcedureKey.BROWSER_AUTHORIZATION_REMEMBER,
      this.handleUsernameSuggestion
    );
  }

  private handleSuccessfulAuth = (account: IAccount) => {
    this.account = account;
    this.authLoading = false;
    if (this.rememberMe) {
      this.rageClientService.triggerClient(ProcedureKey.CLIENT_AUTHORIZATION_REMEMBER_ME, account.username);
    }
  };

  private handleAuthError = (error: ApiError) => {
    this.authLoading = false;
    this.messageService.add({ severity: 'error', detail: error.message });
  };

  submitAuthForm() {
    if (this.authForm && this.authForm.invalid) {
      return;
    }

    const payload = this.authForm.getRawValue();

    this.authLoading = true;
    this.rageClientService.callServer<IAccount>(ProcedureKey.SERVER_PLAYER_AUTHORIZE, payload)
      .subscribe({ next: this.handleSuccessfulAuth, error: this.handleAuthError });
  }

  discordAuthorize() {
    this.authLoading = true;
    this.rageClientService.callClient<IAccount>(ProcedureKey.CLIENT_AUTHORIZATION_DISCORD)
      .subscribe({
        next: this.handleSuccessfulAuth,
        error: this.handleAuthError
      });
  }
}
