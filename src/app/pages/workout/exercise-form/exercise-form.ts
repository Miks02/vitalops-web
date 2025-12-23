import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
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
import { FormBuilder, FormsModule, Validators, ReactiveFormsModule } from "@angular/forms";
import { ExerciseType } from '../models/ExerciseType';
import { CardioType } from '../models/CardioType';

@Component({
    selector: 'app-exercise-form',
    imports: [NgIcon, FormsModule, ReactiveFormsModule],
    templateUrl: './exercise-form.html',
    styleUrl: './exercise-form.css',
    providers: [provideIcons({faSolidTag, faSolidCalendarDay, faSolidDumbbell, faSolidFireFlameCurved, faSolidBookOpen, faSolidBars, faSolidPencil, faSolidNoteSticky, faSolidXmark})]
})
export class ExerciseForm {
    @Output() close = new EventEmitter<void>();
    exerciseType: ExerciseType = 1;
    cardioType: number = 1;

    private fb = inject(FormBuilder)

    form = this.fb.group({
        exerciseName: ['', Validators.required],
        exerciseType: [ExerciseType.Weights, Validators.required],
        cardioType: [CardioType.SteadyState],
        durationMinutes: [null],
        durationSeconds: [null],
        distanceKm: [null],
        avgHeartRate: [null],
        caloriesBurned: [null],
        paceMinPerKm: [null],
        workIntervalSec: [null],
        restIntervalSec: [null],
        intervalsCount: [null],
        sets: this.fb.array([])
    })

    ngOnInit() {
        this.form.get('exerciseType')!.valueChanges.subscribe(type => {
            this.exerciseType = type as ExerciseType
            console.log(this.exerciseType)

            if(type === ExerciseType.Cardio) {
                this.form.get('cardioType')?.addValidators(Validators.required)
                this.form.get('cardioType')?.patchValue(CardioType.SteadyState)

            }

        })

        this.form.get('cardioType')!.valueChanges.subscribe(type => {
            this.cardioType = type as CardioType

            console.log(this.cardioType)

            if(type === CardioType.SteadyState)
            {
                console.log("kitina")
            }
            if(type === CardioType.Hiit) {
                console.log("SItina")
            }

        })
    }

    onClose() {
        this.close.emit();
    }

    onSelect() {
        console.log(this.exerciseType);
    }

    onSubmit() {
        if(this.form.invalid) {
            console.log("Exercise form is not valid")
            console.log(this.form.value)
            return;
        }
        console.log("Exercise form is valid")
        console.log(this.form.value);
    }

}
