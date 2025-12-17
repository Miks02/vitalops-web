import { Component, signal, inject } from '@angular/core';
import {NgIcon, provideIcons} from '@ng-icons/core';
import {faSolidLock, faSolidCheck, faSolidEnvelope} from '@ng-icons/font-awesome/solid';
import {Router, RouterLink} from '@angular/router';
import {ReactiveFormsModule, FormBuilder, Validators, FormsModule} from '@angular/forms';
import { AuthService } from '../../core/services/auth-service';
import { LoginRequest } from '../../core/models/LoginRequest';

@Component({
  selector: 'app-login',
  imports: [
    NgIcon,
    RouterLink,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
  providers: [provideIcons({faSolidEnvelope, faSolidLock, faSolidCheck})]
})
export class Login {
    errorMessage = signal('')

    private readonly fb = inject(FormBuilder);
    private readonly authService = inject(AuthService)

    form = this.fb.group({
        email: ['', Validators.required],
        password: ['', Validators.required],
        rememberMe: [false]
    });

    get email() {return this.form.get('email')}
    get password() {return this.form.get('password')}

    onSubmit() {
        if(this.form.invalid)
        {
            this.form.markAllAsTouched();
            return;
        }

        this.authService.login(this.form.value as LoginRequest).subscribe({
            next: res => {
                console.log("Login successful")
                console.log()
            },
            error: err => {
                console.log("Error happened during the login process\n" + err.message)
            }
        })
    }

}
