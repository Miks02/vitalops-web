import { Component, inject, signal, WritableSignal } from '@angular/core';
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

interface UserData {
    name: string;
    username: string;
    email: string;
    dateOfBirth: string;
    gender: string;
    weight: number;
    height: number;
    profileImage?: string;
}

@Component({
  selector: 'app-profile-page',
  imports: [NgIcon, FormsModule, ReactiveFormsModule, DatePipe, WorkoutsChart, WeightChart],
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

    profileForm: FormGroup = this.fb.group({}) as FormGroup;
    profilePictureForm: FormGroup = this.fb.group({}) as FormGroup;
    editingField: string | null = null;
    selectedProfileImageFile: WritableSignal<File | null> = signal(null);
    previewImage: WritableSignal<string> = signal("");

    userData: UserData = {
        name: 'Milan Nikolić',
        username: 'mixx02',
        email: 'milan@example.com',
        dateOfBirth: '2002-11-03',
        gender: 'Male',
        weight: 85,
        height: 172
    };

    ngOnInit() {
        this.layoutState.setTitle("My Profile");
        this.initForm();
        this.initSampleWorkouts();
    }

    initForm() {
        this.profileForm = this.fb.group({
            name: [this.userData.name],
            username: [this.userData.username],
            email: [this.userData.email],
            dateOfBirth: [this.userData.dateOfBirth],
            gender: [this.userData.gender],
            weight: [this.userData.weight],
            height: [this.userData.height]
        });
    }

    startEditing(field: string) {
        this.editingField = field;
    }

    saveField(field: string) {
        if (this.profileForm.get(field)?.valid) {
            (this.userData as any)[field] = this.profileForm.get(field)?.value;
            this.editingField = null;
        }
    }

    cancelEditing() {
        this.editingField = null;
        this.initForm();
    }

    isEditing(field: string): boolean {
        return this.editingField === field;
    }

    lastWorkouts: Array<{name: string; date: string; exercises: number}> = [];

    initSampleWorkouts() {
        this.lastWorkouts = [
            { name: 'Full Body Blast', date: '2025-12-30', exercises: 8 },
            { name: 'Upper Strength', date: '2025-12-28', exercises: 6 },
            { name: 'Leg Power', date: '2025-12-26', exercises: 7 },
            { name: 'HIIT Session', date: '2025-12-24', exercises: 5 },
            { name: 'Core Focus', date: '2025-12-22', exercises: 4 },
            { name: 'Push/Pull', date: '2025-12-20', exercises: 6 },
            { name: 'Cardio Mix', date: '2025-12-18', exercises: 3 },
            { name: 'Strength Endurance', date: '2025-12-15', exercises: 9 },
            { name: 'Mobility Flow', date: '2025-12-12', exercises: 4 },
            { name: 'Upper Hypertrophy', date: '2025-12-10', exercises: 7 }
        ];
    }

    getProfileImageSrc(): string {
        if (this.previewImage() !== "") return this.previewImage();
        if ((this.userData as any).profileImage) return (this.userData as any).profileImage;
        return this.userData.gender === 'Male' ? 'user_male.png' : (this.userData.gender === 'Female' ? 'user_female.png' : 'user_other.png');
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
        if (this.previewImage) {
            (this.userData as any).profileImage = this.previewImage;
            this.selectedProfileImageFile.set(null);
            this.previewImage.set("");
        }
    }

    cancelProfilePicture() {
        this.selectedProfileImageFile.set(null);
        this.previewImage.set("");
    }
}
