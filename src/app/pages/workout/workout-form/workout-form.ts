import { Component, inject } from '@angular/core';
import { NgIcon, provideIcons } from "@ng-icons/core";
import {
    faSolidCalendarDay,
    faSolidTag,
    faSolidDumbbell,
    faSolidFireFlameCurved,
    faSolidBookOpen,
    faSolidBars,
    faSolidNoteSticky,
    faSolidXmark,
    faSolidCircle,
    faSolidPersonRunning,
    faSolidChildReaching
} from "@ng-icons/font-awesome/solid";
import { LayoutState } from '../../../layout/services/layout-state';
import { FormBuilder, FormsModule, ReactiveFormsModule, FormArray, AbstractControl,} from '@angular/forms';
import { ExerciseForm } from "../exercise-form/exercise-form";
import { ExerciseType } from '../models/ExerciseType';
import { CardioType } from '../models/CardioType';
import { createWorkoutForm, createWorkoutObject } from '../../../core/helpers/Factories';
import { WorkoutService } from '../services/workout-service';
import { Router } from '@angular/router';
import { NotificationService } from '../../../core/services/notification-service';
import { handleValidationErrors, isControlValid } from '../../../core/helpers/FormHelpers';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-workout-form',
    imports: [NgIcon, FormsModule, ExerciseForm, ReactiveFormsModule, DatePipe],
    templateUrl: './workout-form.html',
    styleUrl: './workout-form.css',
    providers: [provideIcons({faSolidTag, faSolidCalendarDay, faSolidDumbbell, faSolidFireFlameCurved, faSolidBookOpen, faSolidBars, faSolidNoteSticky, faSolidXmark, faSolidCircle, faSolidPersonRunning, faSolidChildReaching})]
})
export class WorkoutForm {
    isControlValid = isControlValid
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

    getTotalSets(): number {
        let total = 0;
        for (const exercise of this.exercises.controls) {
            const sets = exercise.get('sets') as FormArray | null;
            total += sets?.length ?? 0;
        }
        return total;
    }

    getWeightExerciseCount(): number {
        return this.getExerciseTypeCount(ExerciseType.Weights);
    }

    getBodyweightExerciseCount(): number {
        return this.getExerciseTypeCount(ExerciseType.Bodyweight);
    }

    getCardioExerciseCount(): number {
        return this.getExerciseTypeCount(ExerciseType.Cardio);
    }

    private getExerciseTypeCount(type: ExerciseType): number {
        let count = 0;
        for (const exercise of this.exercises.controls) {
            if (exercise.get('exerciseType')?.value === type) {
                count++;
            }
        }
        return count;
    }

    getExerciseSets(exercise: AbstractControl): number {
        return (exercise.get('sets') as Object as []).length;
    }

    getExerciseType(exercise: AbstractControl): number {
        return (exercise.get('exerciseType'))?.value
    }

    isExerciseTypeCardio(exercise: AbstractControl): boolean {
        return exercise.get('exerciseType')?.value === ExerciseType.Cardio
    }

    isCardioTypeSteadyState(exercise: AbstractControl): boolean {
        return exercise.get('cardioType')?.value === CardioType.SteadyState
    }

    exerciseTypeLabel(exercise: AbstractControl): string {
        const type = exercise.get('exerciseType')?.value;
        if (type === ExerciseType.Cardio) {
            return 'Cardio';
        }
        if (type === ExerciseType.Bodyweight) {
            return 'Bodyweight';
        }
        return 'Weights';
    }

    getSetCount(exercise: AbstractControl): number {
        const sets = exercise.get('sets') as FormArray;
        return sets?.length ?? 0;
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
            error: err  => {
                if(err.error.errorCode === "General.LimitReached") {
                    this.notificationService.showWarning("Slow down! You've logged 5 workouts today. Rest is just as important as the grind. Try again tomorrow!");
                    return;
                }
                handleValidationErrors(err, this.form);
            }
        })
    }
}
