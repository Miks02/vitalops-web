import { Component, inject } from '@angular/core';
import { NgIcon, provideIcons } from "@ng-icons/core";
import {
    faSolidCalendarDay,
    faSolidTag,
    faSolidDumbbell,
    faSolidFireFlameCurved,
    faSolidBookOpen,
    faSolidBars,
    faSolidPencil,
    faSolidNoteSticky,
    faSolidXmark,
    faSolidCircle,
    faSolidPersonRunning
} from "@ng-icons/font-awesome/solid";
import { LayoutState } from '../../../layout/services/layout-state';
import { FormBuilder, FormsModule, ReactiveFormsModule, FormArray, AbstractControl,} from '@angular/forms';
import { ExerciseForm } from "../exercise-form/exercise-form";
import { ExerciseType } from '../models/ExerciseType';
import { CardioType } from '../models/CardioType';
import { createWorkoutForm, createWorkoutObject } from '../../../core/helpers/Factories';
import { WorkoutService } from '../services/workout-service';
import { CreateWorkoutDto } from '../models/CreateWorkoutDto';
import { ExerciseEntryFormValue } from '../models/ExerciseEntryFormValue';
import { Router } from '@angular/router';
import { NotificationService } from '../../../core/services/notification-service';

@Component({
    selector: 'app-workout-form',
    imports: [NgIcon, FormsModule, ExerciseForm, ReactiveFormsModule],
    templateUrl: './workout-form.html',
    styleUrl: './workout-form.css',
    providers: [provideIcons({faSolidTag, faSolidCalendarDay, faSolidDumbbell, faSolidFireFlameCurved, faSolidBookOpen, faSolidBars, faSolidPencil, faSolidNoteSticky, faSolidXmark, faSolidCircle, faSolidPersonRunning})]
})
export class WorkoutForm {
    isModalFormOpen: boolean = false;

    layoutState = inject(LayoutState)
    fb = inject(FormBuilder)
    workoutService = inject(WorkoutService)
    router = inject(Router)
    notificationService = inject(NotificationService);

    form = createWorkoutForm(this.fb);

    get exercises(): FormArray {
        return this.form.get('exercises') as FormArray
    }

    getExerciseSets(exercise: AbstractControl): number {
        return (exercise.get('sets') as Object as []).length;
    }

    isExerciseTypeCardio(exercise: AbstractControl): boolean {
        return exercise.get('exerciseType')?.value === ExerciseType.Cardio
    }

    isCardioTypeSteadyState(exercise: AbstractControl): boolean {
        return exercise.get('cardioType')?.value === CardioType.SteadyState
    }

    removeExercise(index: number) {
        return this.exercises.removeAt(index);
    }

    ngOnInit() {
        this.layoutState.setTitle("Workout Form")
    }

    closeModalForm() {
        this.isModalFormOpen = false;

        if(this.exercises.length === 0) {
            this.notificationService.showWarning("Add at least 1 exercise entry");
        }
    }

    onSubmit() {
        const workout = createWorkoutObject(this.form);
        if(this.form.invalid) {
            console.log("Invalid form");
            return;
        }
        this.workoutService.addWorkout(workout).subscribe({
            next: () => {
                this.notificationService.showSuccess("Workout logged successfully!")
                this.router.navigate(['/workouts'])
            },
            error: err => {
                console.log("Error occured while creating the workout\n", err)
            }
        })
    }
}
