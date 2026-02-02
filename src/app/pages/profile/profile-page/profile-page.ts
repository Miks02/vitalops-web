import { Component, computed, inject, signal, WritableSignal } from '@angular/core';
import { LayoutState } from '../../../layout/services/layout-state';
import { FormBuilder, FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { NgIcon, provideIcons } from "@ng-icons/core";
import { DatePipe } from '@angular/common';
import {
    faSolidUser,
    faSolidCalendarDay,
    faSolidVenusMars,
    faSolidPencil,
    faSolidCheck,
    faSolidXmark,
    faSolidEnvelope,
    faSolidCamera,
    faSolidAt,
    faSolidTriangleExclamation,
    faSolidTrash,
    faSolidWrench,
    faSolidLock,
    faSolidShieldHalved,
    faSolidKey,
    faSolidClock,
    faSolidRulerVertical,
    faSolidWeightScale
} from "@ng-icons/font-awesome/solid";
import { ProfileService } from '../services/profile-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { AccountStatus } from '../../../core/models/AccountStatus';
import { take } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import {
    createFullNameForm,
    createDateOfBirthForm,
    createUsernameForm,
    createEmailForm,
    createGenderForm,
    createHeightForm
} from '../../../core/helpers/Factories';
import { UserService } from '../../../core/services/user-service';
import { NotificationService } from '../../../core/services/notification-service';
import { handleValidationErrors } from '../../../core/helpers/FormHelpers';
import { environment } from '../../../../environments/environment.development';
import { AuthService } from '../../../core/services/auth-service';
import { Modal } from '../../../layout/utilities/modal/modal';
import { ModalData } from '../../../core/models/ModalData';
import { ModalType } from '../../../core/models/ModalType';
import { PasswordForm } from '../password-form/password-form';

@Component({
    selector: 'app-profile-page',
    imports: [NgIcon, FormsModule, ReactiveFormsModule, DatePipe, RouterLink, Modal, PasswordForm],
    templateUrl: './profile-page.html',
    styleUrl: './profile-page.css',
    providers: [provideIcons({
        faSolidUser,
        faSolidCalendarDay,
        faSolidVenusMars,
        faSolidPencil,
        faSolidCheck,
        faSolidXmark,
        faSolidEnvelope,
        faSolidCamera,
        faSolidAt,
        faSolidTriangleExclamation,
        faSolidTrash,
        faSolidWrench,
        faSolidLock,
        faSolidShieldHalved,
        faSolidKey,
        faSolidClock,
        faSolidRulerVertical,
        faSolidWeightScale
    })]
})
export class ProfilePage {
    private layoutState = inject(LayoutState);
    private fb = inject(FormBuilder);
    private profileService = inject(ProfileService);
    private userService = inject(UserService);
    private authService = inject(AuthService)
    private notificationService = inject(NotificationService);
    private router = inject(Router)

    userData = toSignal(this.userService.userDetails$, {initialValue: null});

    profileDetailsSource = toSignal(this.profileService.profilePage$, {initialValue: null})

    fullNameForm: FormGroup = createFullNameForm(this.fb);
    dateOfBirthForm: FormGroup = createDateOfBirthForm(this.fb);
    usernameForm: FormGroup = createUsernameForm(this.fb);
    emailForm: FormGroup = createEmailForm(this.fb);
    genderForm: FormGroup = createGenderForm(this.fb);
    heightForm: FormGroup = createHeightForm(this.fb);

    editingField: string | null = null;
    selectedProfileImageFile: WritableSignal<File | null> = signal(null);
    previewImage: WritableSignal<string> = signal("");
    isModalOpen = signal(false);
    isPasswordFormOpen = signal(false);

    ngOnInit() {
        this.layoutState.setTitle("My Profile");
        this.profileService.getProfilePage().pipe(take(1)).subscribe((res) => {
            this.initForms();
        });
    }

    genderLabel = computed(() => {
        switch(this.userData()?.gender) {
            case 1:
            return "Male";
            case 2:
            return "Female";
            case 3:
            return "Other";
            default:
            return "Not specified";
        }
    })

    weightLabel = computed(() => {
        const weight = this.userData()?.currentWeight;

        if(!weight)
            return "Not specified";
        return `${weight} KG`
    })

    heightLabel = computed(() => {
        const height = this.userData()?.height;

        if(!height)
            return "Not specified";
        return `${height} CM`
    })

    accountStatusLabel = computed(() => {
        const accountStatus = this.userData()?.accountStatus;

        switch(accountStatus) {
            case AccountStatus.Active:
            return "Active";
            case AccountStatus.Suspended:
            return "Suspended";
            case AccountStatus.Banned:
            return "Banned";
            default:
            return "";
        }
    })

    initForms() {
        const user = this.userData();
        if (!user) return;

        const fullName = user.fullName || '';
        const [firstName, lastName] = fullName.includes(' ')
        ? fullName.split(' ', 2)
        : [fullName, ''];

        this.fullNameForm.patchValue({ firstName, lastName });
        this.dateOfBirthForm.patchValue({ dateOfBirth: user.dateOfBirth || '' });
        this.usernameForm.patchValue({ userName: user.userName || '' });
        this.emailForm.patchValue({ email: user.email || '' });
        this.genderForm.patchValue({ gender: user.gender ?? null });
        this.heightForm.patchValue({ height: user.height ?? null });
    }

    startEditing(field: string) {
        this.editingField = field;
    }

    cancelEditing() {
        this.editingField = null;
        this.initForms();
    }

    private cancelIfUnchangedValue(newValue: any, currentValue: any): boolean {
        if (newValue === currentValue) {
            this.editingField = null;
            return true;
        }
        return false;
    }

    isEditing(field: string): boolean {
        return this.editingField === field;
    }

    isControlValid(form: FormGroup | null | undefined, controlName?: string): boolean {
        if (!form) return true;
        if (controlName) {
            const ctl = form.get(controlName);
            return !!ctl && ctl.valid;
        }
        return form.valid;
    }

    onSubmitFullName() {
        const form = this.fullNameForm;
        if (form.valid) {
            const firstName = form.get('firstName')?.value;
            const lastName = form.get('lastName')?.value;
            const fullName = `${firstName} ${lastName}`.trim();

            if (this.cancelIfUnchangedValue(fullName, this.userData()?.fullName ?? ''))
                return;

            this.userService.updateFullName({firstName: firstName, lastName: lastName})
            .pipe(take(1))
            .subscribe({
                next: () => {
                    this.editingField = null;
                    this.notificationService.showSuccess("Profile updated successfully")
                },
                error: (err) => {
                    handleValidationErrors(err, form);
                }
            });
        }
    }

    onSubmitDateOfBirth() {
        const form = this.dateOfBirthForm;
        if (form.valid) {
            const dateOfBirth = form.get('dateOfBirth')?.value;

            if (this.cancelIfUnchangedValue(dateOfBirth, this.userData()?.dateOfBirth ?? ''))
                return;

            this.userService.updateDateOfBirth({dateOfBirth: dateOfBirth})
            .pipe(take(1))
            .subscribe({
                next: () => {
                    this.editingField = null;
                    this.notificationService.showSuccess("Profile updated successfully")
                },
                error: (err) => {
                    handleValidationErrors(err, form);
                }
            });
        }
    }

    onSubmitUsername() {
        const form = this.usernameForm;
        const username = form.get('userName');

        if (this.cancelIfUnchangedValue(username?.value, this.userData()?.userName))
            return;

        if (form.valid) {

            this.userService.updateUserName({userName: username?.value})
            .pipe(take(1))
            .subscribe({
                next: () => {
                    this.editingField = null;
                    this.notificationService.showSuccess("Profile updated successfully")
                },
                error: (err) => {
                    handleValidationErrors(err, form);
                    if(err.error.status === 409 && err.error.errorCode) {
                        if(err.error.errorCode === "DuplicateUserName") {
                            username?.setErrors({duplicateUserName: true})
                            form.updateValueAndValidity();
                        }
                    }
                }
            });
        }
    }

    onSubmitEmail() {
        const form = this.emailForm;
        if (form.valid) {
            const email = form.get('email');

            if (this.cancelIfUnchangedValue(email?.value, this.userData()?.email))
                return;

            this.userService.updateEmail({email: email?.value})
            .pipe(take(1))
            .subscribe({
                next: () => {
                    this.editingField = null;
                    this.notificationService.showSuccess("Profile updated successfully")
                },
                error: (err) => {
                    handleValidationErrors(err, form);
                    if(err.error.status === 409 && err.error.errorCode) {
                        if(err.error.errorCode === "User.EmailAlreadyExists") {
                            email?.setErrors({emailTaken: true})
                            form.updateValueAndValidity();
                        }
                    }
                }
            });
        }
    }

    onSubmitGender() {
        const form = this.genderForm;
        if (form.valid) {
            const gender = form.get('gender')?.value;
            if (this.cancelIfUnchangedValue(Number(gender), Number(this.userData()?.gender ?? null)))
                return;

            this.userService.updateGender({gender: gender})
            .pipe(take(1))
            .subscribe({
                next: () => {
                    this.editingField = null;
                    this.notificationService.showSuccess("Profile updated successfully")
                },
                error: (err) => {
                    handleValidationErrors(err, form);
                }
            });
        }
    }

    onSubmitHeight() {
        const form = this.heightForm;
        if (form.valid) {
            const height = form.get('height')?.value;
            if (this.cancelIfUnchangedValue(Number(height), Number(this.userData()?.height ?? null)))
                return;

            this.userService.updateHeight({height: height})
            .pipe(take(1))
            .subscribe({
                next: () => {},
                error: (err) => {
                    handleValidationErrors(err, form);
                }
            });
        }
    }

    getProfileImageSrc(): string {
        if (this.previewImage() !== "") return this.previewImage();
        if (this.userData()?.imagePath  && this.userData()?.imagePath !== null) return this.userData()!.imagePath as string;
        return this.userData()?.gender === 1 ? 'user_male.png' : (this.userData()?.gender === 2 ? 'user_female.png' : 'user_other.png');
    }

    onProfilePictureSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (!input.files || input.files.length === 0) return;
        const file = input.files[0];
        this.selectedProfileImageFile.set(file);
        const reader = new FileReader();
        reader.onload = () => {
            this.previewImage.set(reader.result as string);
        };
        reader.readAsDataURL(file);
    }

    saveProfilePicture() {
        if (this.selectedProfileImageFile()) {
            this.userService.updateProfilePicture(this.selectedProfileImageFile()!)
            .pipe(take(1))
            .subscribe({
                next: (imagePath) => {
                    this.previewImage.set("");
                    this.selectedProfileImageFile.set(null);
                    this.notificationService.showSuccess("Profile picture updated successfully");
                },
                error: (err) => {
                    console.error('Error uploading profile picture:', err);
                    this.notificationService.showError("Failed to update profile picture");
                }
            });
        }
    }

    cancelProfilePicture() {
        this.selectedProfileImageFile.set(null);
        this.previewImage.set("");
    }

    removeProfilePicture() {
        this.userService.deleteProfilePicture()
        .pipe(take(1))
        .subscribe({
            next: () => {
                this.notificationService.showSuccess("Profile picture removed successfully");
            },
            error: (err) => {
                console.error('Error uploading profile picture:', err);
                this.notificationService.showError("Unexpected error happened while trying to delete a profile picture");
            }
        })
    }

    openDeleteAccountModal() {
        this.isModalOpen.set(true);
    }

    closeModal() {
        this.isModalOpen.set(false);
    }

    deleteProfile() {
        this.userService.deleteAccount()
        .pipe(take(1))
        .subscribe({
            next: () => {
                this.notificationService.showSuccess("Your account has been deleted successfully")
                this.authService.clearAuthData();
                this.router.navigate(['/login']);
            }
        })
    }

    buildModal(): ModalData {
        return {
            title: 'Delete Account',
            subtitle: 'You are about to permanently delete your account. This action cannot be undone and all your data will be lost.',
            type: ModalType.Warning,
            primaryActionLabel: 'Confirm',
            secondaryActionLabel: 'Cancel',
            primaryAction: () => this.deleteProfile(),
            secondaryAction: () => this.isModalOpen.set(false)
        };
    }
}
