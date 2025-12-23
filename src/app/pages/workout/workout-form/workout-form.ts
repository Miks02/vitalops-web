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
  faSolidXmark
} from "@ng-icons/font-awesome/solid";
import { LayoutState } from '../../../layout/services/layout-state';
import { FormBuilder, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { ExerciseForm } from "../exercise-form/exercise-form";

@Component({
  selector: 'app-workout-form',
  imports: [NgIcon, FormsModule, ExerciseForm, ReactiveFormsModule],
  templateUrl: './workout-form.html',
  styleUrl: './workout-form.css',
  providers: [provideIcons({faSolidTag, faSolidCalendarDay, faSolidDumbbell, faSolidFireFlameCurved, faSolidBookOpen, faSolidBars, faSolidPencil, faSolidNoteSticky, faSolidXmark})]
})
export class WorkoutForm {
    isModalFormOpen: boolean = false;
    exerciseType: number = 1;

    layoutState = inject(LayoutState)
    fb = inject(FormBuilder)

    form = this.fb.group({
        workoutName: ['', Validators.required],
        date: ['', Validators.required],
        exercises: [[]],
        notes: []
    })

    ngOnInit() {
        this.layoutState.setTitle("Workout Form")
    }

    closeModalForm(event: void) {
        this.isModalFormOpen = false;
    }

    onSubmit() {
        console.log(this.form.value)
        if(this.form.invalid) {
            this.form.markAllAsTouched();
            console.log("Invalid form");
            return;
        }
        console.log("Form sent successfully")
    }

}
