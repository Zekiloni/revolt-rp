import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { Divider } from 'primeng/divider';
import { ButtonDirective } from 'primeng/button';
import { StyleClass } from 'primeng/styleclass';
import { AuthService } from '../../core/service/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputText,
    Divider,
    ButtonDirective,
    StyleClass
  ],
  providers: [AuthService],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  loginForm: FormGroup;

  showLogin = signal(false);

  constructor(private formBuilder: FormBuilder, private authService: AuthService) {
    this.loginForm = this.formBuilder.group({
      username: [''],
      password: ['']
    });
  }


  switchToRegister() {
    this.showLogin.set(false);
  }

  switchToLogin() {
    this.showLogin.set(true);
  }

  onDiscordAuth() {
    this.authService.discordOauth2();
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const formData = this.loginForm.value;
      console.log('Form Data:', formData);
      // Handle authentication logic here
    }
  }
}
