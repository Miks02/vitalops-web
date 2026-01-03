import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root',
})
export class NotificationService {

    private snackBar = inject(MatSnackBar)

    showSuccess(message: string) {
        this.snackBar.open(message, 'Close', {
            panelClass: ['success-snackbar'],
            horizontalPosition: 'right',
            verticalPosition: 'top',
            duration: 4000
        });
    }

    showError(message: string, duration?: number) {
        this.snackBar.open(message, 'Close', {
            panelClass: ['error-snackbar'],
            horizontalPosition: 'right',
            verticalPosition: 'top',
            duration: duration ?? Infinity
        });
    }

    showWarning(message: string) {
        this.snackBar.open(message, 'Close', {
            panelClass: ['warning-snackbar'],
            horizontalPosition: 'right',
            verticalPosition: 'top',
            duration: 4000
        });
    }

    showInfo(message: string) {
        this.snackBar.open(message, 'Close', {
            panelClass: ['info-snackbar'],
            horizontalPosition: 'right',
            verticalPosition: 'top',
            duration: 4000
        });
    }

}
