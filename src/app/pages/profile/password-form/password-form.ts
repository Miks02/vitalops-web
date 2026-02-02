import { Component, EventEmitter, inject, Output } from '@angular/core';
import { NgIcon, provideIcons } from "@ng-icons/core";
import { faSolidCircleInfo, faSolidInfo, faSolidKey, faSolidLock, faSolidXmark } from "@ng-icons/font-awesome/solid";
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { createChangePasswordForm } from '../../../core/helpers/Factories';
import { handleValidationErrors, isControlValid } from '../../../core/helpers/FormHelpers';
import { NotificationService } from '../../../core/services/notification-service';
import { AuthService } from '../../../core/services/auth-service';
import { UpdatePasswordDto } from '../../../core/models/User/UpdatePasswordDto';
import { take } from 'rxjs';
import { Router } from '@angular/router';

@Component({
    selector: 'app-password-form',
    imports: [NgIcon, FormsModule, ReactiveFormsModule],
    templateUrl: './password-form.html',
    styleUrl: './password-form.css',
    providers: [provideIcons({faSolidKey, faSolidLock, faSolidXmark, faSolidCircleInfo})]
})
export class PasswordForm {
    @Output()
    close = new EventEmitter<void>();

    private router = inject(Router);
    private authService = inject(AuthService);
    private fb = inject(FormBuilder);
    private notificationService = inject(NotificationService);

    form = createChangePasswordForm(this.fb);
    isControlValid = isControlValid;

    onClose() {
        this.close.emit();
    }

    onSubmit() {
        if (this.form.invalid) {
            return;
        }

        const newPassword = this.form.get('newPassword')?.value;
        const confirmPassword = this.form.get('confirmPassword')?.value;

        if (newPassword !== confirmPassword) {
            this.form.get('confirmPassword')?.setErrors({ mismatch: true });
            this.notificationService.showWarning('Passwords do not match');
            return;
        }

        this.authService.changePassword(this.form.value)
        .pipe(take(1))
        .subscribe({
            next: () => {
                this.notificationService.showSuccess("Password changed successfully")
                this.authService.clearAuthData();
                this.router.navigate(['/login']);
            },
            error: (err) => {
                handleValidationErrors(err, this.form);

                if (err.error?.errorCode === 'User.InvalidPassword' || err.error?.errorCode === 'Auth.InvalidCurrentPassword') {
                    this.form.get('currentPassword')?.setErrors({ invalid: true });
                    this.notificationService.showError('Current password is incorrect');
                } else if (err.error?.errorCode === 'Auth.PasswordTooShort') {
                    this.form.get('newPassword')?.setErrors({ tooShort: true });
                    this.notificationService.showError('Password is too short');
                } else if (err.error?.errorCode === 'Auth.PasswordRequiresDigit') {
                    this.form.get('newPassword')?.setErrors({ requiresDigit: true });
                    this.notificationService.showError('Password must contain at least one digit');
                } else if (err.error?.errorCode === 'Auth.PasswordRequiresUpper') {
                    this.form.get('newPassword')?.setErrors({ requiresUpper: true });
                    this.notificationService.showError('Password must contain at least one uppercase letter');
                } else if (err.error?.errorCode === 'Auth.PasswordRequiresNonAlphanumeric') {
                    this.form.get('newPassword')?.setErrors({ requiresNonAlphanumeric: true });
                    this.notificationService.showError('Password must contain at least one special character');
                } else {
                    this.notificationService.showError('Failed to change password');
                }
            }
        })

    }
}
