import { Component, computed, inject, signal, WritableSignal } from '@angular/core';
import { LayoutState } from '../../../layout/services/layout-state';
import { FormBuilder, FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { NgIcon, provideIcons } from "@ng-icons/core";
import { DatePipe } from '@angular/common';
import {
  faSolidUser,
  faSolidCalendarDay,
  faSolidVenusMars,
  faSolidWeightScale,
  faSolidRulerVertical,
  faSolidPencil,
  faSolidCheck,
  faSolidXmark,
  faSolidEnvelope,
  faSolidDumbbell,
  faSolidUtensils,
  faSolidScaleUnbalanced,
  faSolidShieldHalved,
  faSolidAddressCard,
  faSolidCalculator,
  faSolidFireFlameCurved
} from "@ng-icons/font-awesome/solid";
import {
    faSolidLock,
    faSolidKey,
    faSolidTrash
} from "@ng-icons/font-awesome/solid";
import { WorkoutsChart } from "../../misc/workouts-chart/workouts-chart";
import { WeightChart } from "../../misc/weight-chart/weight-chart";
import { ProfileService } from '../services/profile-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { UserDetailsDto } from '../../../core/models/UserDetailsDto';
import { AccountStatus } from '../../../core/models/AccountStatus';
import { tap } from 'rxjs';
import { WorkoutListItemDto } from '../../workout/models/WorkoutListItemDto';
import { RouterLink } from '@angular/router';
import {
    createFullNameForm,
    createDateOfBirthForm,
    createUsernameForm,
    createEmailForm,
    createGenderForm,
    createWeightForm,
    createHeightForm,
    createProfilePictureForm
} from '../../../core/helpers/Factories';

@Component({
  selector: 'app-profile-page',
  imports: [NgIcon, FormsModule, ReactiveFormsModule, DatePipe, WorkoutsChart, WeightChart, RouterLink],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.css',
  providers: [provideIcons({
    faSolidUser,
    faSolidCalendarDay,
    faSolidVenusMars,
    faSolidWeightScale,
    faSolidRulerVertical,
    faSolidPencil,
    faSolidCheck,
    faSolidXmark,
    faSolidEnvelope,
    faSolidDumbbell,
    faSolidLock,
    faSolidTrash,
    faSolidUtensils,
    faSolidScaleUnbalanced,
    faSolidCalculator,
    faSolidShieldHalved,
    faSolidKey,
    faSolidAddressCard,
    faSolidFireFlameCurved
  })]
})
export class ProfilePage {
    private layoutState = inject(LayoutState);
    private fb = inject(FormBuilder);
    private profileService = inject(ProfileService);

    userData: WritableSignal<UserDetailsDto | undefined> = signal(undefined);
    recentWorkouts: WritableSignal<WorkoutListItemDto[]> = signal([]);
    workoutStreak: WritableSignal<number | undefined> = signal(undefined);
    dailyCalorieGoal: WritableSignal<number | undefined> = signal(undefined);

    profileDetails = toSignal(this.profileService.profilePage$.pipe(
        tap(res => {
            this.userData.set(res?.userDetails);
            this.recentWorkouts.set(res?.recentWorkouts as WorkoutListItemDto[]);
            this.workoutStreak.set(res?.workoutStreak);
            this.dailyCalorieGoal.set(res?.dailyCalorieGoal);
            this.initForms();
        })
    ))

    fullNameForm: WritableSignal<FormGroup> = signal(this.fb.group({}));
    dateOfBirthForm: WritableSignal<FormGroup> = signal(this.fb.group({}));
    usernameForm: WritableSignal<FormGroup> = signal(this.fb.group({}));
    emailForm: WritableSignal<FormGroup> = signal(this.fb.group({}));
    genderForm: WritableSignal<FormGroup> = signal(this.fb.group({}));
    weightForm: WritableSignal<FormGroup> = signal(this.fb.group({}));
    heightForm: WritableSignal<FormGroup> = signal(this.fb.group({}));
    profilePictureForm: WritableSignal<FormGroup> = signal(this.fb.group({}));

    editingField: string | null = null;
    selectedProfileImageFile: WritableSignal<File | null> = signal(null);
    previewImage: WritableSignal<string> = signal("");

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
        const weight = this.userData()?.weight;

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

    ngOnInit() {
        this.layoutState.setTitle("My Profile");
        this.profileService.getProfilePage().subscribe((res) => {
            this.userData.set(res?.userDetails);
            this.initForms();
        });
    }

    initForms() {
        const user = this.userData();
        if (!user) return;

        const fullName = user.fullName || '';
        const [firstName, lastName] = fullName.includes(' ')
            ? fullName.split(' ', 2)
            : [fullName, ''];

        this.fullNameForm.set(createFullNameForm(this.fb, firstName, lastName));
        this.dateOfBirthForm.set(createDateOfBirthForm(this.fb, user.dateOfBirth || ''));
        this.usernameForm.set(createUsernameForm(this.fb, user.userName || ''));
        this.emailForm.set(createEmailForm(this.fb, user.email || ''));
        this.genderForm.set(createGenderForm(this.fb, user.gender || null));
        this.weightForm.set(createWeightForm(this.fb, user.weight || null));
        this.heightForm.set(createHeightForm(this.fb, user.height || null));
        this.profilePictureForm.set(createProfilePictureForm(this.fb));
    }

    startEditing(field: string) {
        this.editingField = field;
    }

    cancelEditing() {
        this.editingField = null;
        this.initForms();
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
        const form = this.fullNameForm();
        if (form.valid) {
            const firstName = form.get('firstName')?.value;
            const lastName = form.get('lastName')?.value;
            if (this.userData()) {
                (this.userData as any).fullName = `${firstName} ${lastName}`;
            }
            this.editingField = null;
        }
    }

    onSubmitDateOfBirth() {
        const form = this.dateOfBirthForm();
        if (form.valid) {
            const dateOfBirth = form.get('dateOfBirth')?.value;
            if (this.userData()) {
                (this.userData as any).dateOfBirth = dateOfBirth;
            }
            this.editingField = null;
        }
    }

    onSubmitUsername() {
        const form = this.usernameForm();
        if (form.valid) {
            const username = form.get('username')?.value;
            if (this.userData()) {
                (this.userData as any).userName = username;
            }
            this.editingField = null;
        }
    }

    onSubmitEmail() {
        const form = this.emailForm();
        if (form.valid) {
            const email = form.get('email')?.value;
            if (this.userData()) {
                (this.userData as any).email = email;
            }
            this.editingField = null;
        }
    }

    onSubmitGender() {
        const form = this.genderForm();
        if (form.valid) {
            const gender = form.get('gender')?.value;
            if (this.userData()) {
                (this.userData as any).gender = gender;
            }
            this.editingField = null;
        }
    }

    onSubmitWeight() {
        const form = this.weightForm();
        if (form.valid) {
            const weight = form.get('weight')?.value;
            if (this.userData()) {
                (this.userData as any).weight = weight;
            }
            this.editingField = null;
        }
    }

    onSubmitHeight() {
        const form = this.heightForm();
        if (form.valid) {
            const height = form.get('height')?.value;
            if (this.userData()) {
                (this.userData as any).height = height;
            }
            this.editingField = null;
        }
    }

    getProfileImageSrc(): string {
        if (this.previewImage() !== "") return this.previewImage();
        if ((this.userData as any).profileImage) return (this.userData as any).profileImage;
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
        if (this.previewImage()) {
            const form = this.profilePictureForm();
            form.get('profileImage')?.setValue(this.previewImage());
            this.onSubmitProfilePicture();
        }
    }

    cancelProfilePicture() {
        this.selectedProfileImageFile.set(null);
        this.previewImage.set("");
    }

    onSubmitProfilePicture() {
        const form = this.profilePictureForm();
        if (this.previewImage()) {
            (this.userData as any).profileImage = this.previewImage();
            this.selectedProfileImageFile.set(null);
            this.previewImage.set("");
        }
    }
}
