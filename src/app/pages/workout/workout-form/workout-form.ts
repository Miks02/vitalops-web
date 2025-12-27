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
import { FormBuilder, FormsModule, Validators, ReactiveFormsModule, FormArray, AbstractControl,} from '@angular/forms';
import { ExerciseForm } from "../exercise-form/exercise-form";
import { minArrayLength } from '../../../core/helpers/FormHelpers';
import { ExerciseType } from '../models/ExerciseType';
import { CardioType } from '../models/CardioType';

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

    form = this.fb.group({
        workoutName: ['', Validators.required],
        date: ['', Validators.required],
        exercises: this.fb.array([], [minArrayLength(1)]),
        notes: ['']
    })

    get exercises(): FormArray {
        return this.form.get('exercises') as FormArray
    }

    getExerciseSets(exercise: AbstractControl): number {
        console.log(this.exercises)
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
        console.log(this.exercises.value)
    }

    onSubmit() {
        console.log(this.form.value)
        if(this.form.invalid) {
            console.log("Invalid form");
            return;
        }
        console.log("Form sent successfully")
    }

}
