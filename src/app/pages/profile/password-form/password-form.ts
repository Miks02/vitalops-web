import { Component, EventEmitter, inject, Output } from '@angular/core';
import { NgIcon, provideIcons } from "@ng-icons/core";
import { faSolidKey, faSolidLock, faSolidXmark } from "@ng-icons/font-awesome/solid";
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { createChangePasswordForm } from '../../../core/helpers/Factories';
import { isControlValid } from '../../../core/helpers/FormHelpers';
import { UserService } from '../../../core/services/user-service';
import { NotificationService } from '../../../core/services/notification-service';
import { take } from 'rxjs';

@Component({
    selector: 'app-password-form',
    imports: [NgIcon, FormsModule, ReactiveFormsModule],
    templateUrl: './password-form.html',
    styleUrl: './password-form.css',
    providers: [provideIcons({faSolidKey, faSolidLock, faSolidXmark})]
})
export class PasswordForm {
    @Output()
    close = new EventEmitter<void>();
    
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
    }
}
