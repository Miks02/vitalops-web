import { Component, signal, inject, WritableSignal } from '@angular/core';
import {NgIcon, provideIcons} from '@ng-icons/core';
import {faSolidLock, faSolidCheck, faSolidEnvelope} from '@ng-icons/font-awesome/solid';
import {Router, RouterLink} from '@angular/router';
import {ReactiveFormsModule, FormBuilder, Validators, FormsModule} from '@angular/forms';
import { AuthService } from '../../core/services/auth-service';
import { LoginRequest } from '../../core/models/LoginRequest';
import { finalize, Subject, takeUntil } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
    selector: 'app-login',
    imports: [
        NgIcon,
        RouterLink,
        ReactiveFormsModule,
        FormsModule,
        MatProgressSpinnerModule
    ],
    templateUrl: './login.html',
    styleUrl: './login.css',
    providers: [provideIcons({faSolidEnvelope, faSolidLock, faSolidCheck})]
})
export class Login {
    private destroy$ = new Subject<void>

    private readonly fb = inject(FormBuilder);
    private readonly authService = inject(AuthService)

    isLoading: WritableSignal<boolean> = signal(false);

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
        this.isLoading.set(true);

        this.authService.login(this.form.value as LoginRequest)
        .pipe(takeUntil(this.destroy$), finalize(() => this.isLoading.set(false)))
        .subscribe()
    }

}
