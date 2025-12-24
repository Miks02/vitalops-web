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
    faSolidXmark,
    faSolidCircle,
} from "@ng-icons/font-awesome/solid";
import { FormBuilder, FormsModule, Validators, ReactiveFormsModule, FormArray, FormGroup } from "@angular/forms";
import { ExerciseType } from '../models/ExerciseType';
import { CardioType } from '../models/CardioType';
import { onlyNumbersCheck, minArrayLength } from '../../../core/helpers/Validators';

@Component({
    selector: 'app-exercise-form',
    imports: [NgIcon, FormsModule, ReactiveFormsModule],
    templateUrl: './exercise-form.html',
    styleUrl: './exercise-form.css',
    providers: [provideIcons({faSolidTag, faSolidCalendarDay, faSolidDumbbell, faSolidFireFlameCurved, faSolidBookOpen, faSolidBars, faSolidPencil, faSolidNoteSticky, faSolidXmark, faSolidCircle})]
})
export class ExerciseForm {
    @Output()
    close = new EventEmitter<void>();
    @Input()
    exercises!: FormArray;

    private fb = inject(FormBuilder)

    form = this.fb.group({
        exerciseName: ['', Validators.required],
        exerciseType: [ExerciseType.Weights, Validators.required],
        cardioType: [CardioType.SteadyState as null | CardioType],
        durationMinutes: [null as number | null],
        durationSeconds: [null as number | null],
        distance: [null as number | null],
        avgHeartRate: [null as number | null],
        maxHeartRate: [null as number | null],
        caloriesBurned: [null as number | null],
        pace: [null as number | null],
        workInterval: [null as number | null],
        restInterval: [null as number | null],
        intervalsCount: [null as number | null],
        tempWeight: null as number | null,
        tempReps: null as number | null,
        sets: this.fb.array([], [minArrayLength(1)])
    })



    ngOnInit() {
        this.form.reset();
        this.form.get('exerciseType')?.patchValue(ExerciseType.Weights)
        if(this.form.get('exerciseType')?.value === ExerciseType.Weights || this.form.get('exerciseType')?.value === ExerciseType.Bodyweight) {
            this.form.get('tempWeight')?.addValidators([Validators.required, Validators.min(1), onlyNumbersCheck()])
            this.form.get('tempReps')?.addValidators([Validators.required, Validators.min(1), onlyNumbersCheck()])
        }
        this.form.get('exerciseType')!.valueChanges.subscribe(type => {

            if(type === ExerciseType.Cardio) {
                this.form.get('cardioType')?.addValidators(Validators.required)
                this.form.get('cardioType')?.patchValue(CardioType.SteadyState)
                this.tempWeight?.removeValidators([Validators.required, Validators.min(1)]);
                this.tempReps?.removeValidators([Validators.required, Validators.min(1)]);
                this.tempWeight?.patchValue(null);
                this.tempReps?.patchValue(null);

            }
            if(type === ExerciseType.Weights || type === ExerciseType.Bodyweight) {
                this.form.get('tempWeight')?.addValidators([Validators.required, onlyNumbersCheck()])
                this.form.get('tempReps')?.addValidators([Validators.required, onlyNumbersCheck()])
            }


        })

        this.form.get('cardioType')!.valueChanges.subscribe(type => {


            if(type === CardioType.SteadyState)
                {
                this.form.get('durationMinutes')!.addValidators([Validators.required, Validators.min(0)])
                this.form.get('durationSeconds')!.addValidators([Validators.required, Validators.min(0)])
                this.form.get('pace')!.addValidators([Validators.min(0)])
                this.form.get('distance')!.addValidators([Validators.min(0)])
                this.form.get('avgHeartRate')!.addValidators([Validators.min(0)])
                this.form.get('caloriesBurned')!.addValidators([Validators.min(0)])

            }
            if(type === CardioType.Hiit) {
                this.form.get('workInterval')!.addValidators([Validators.required, Validators.min(0)])
                this.form.get('restInterval')!.addValidators([Validators.required, Validators.min(0)])
                this.form.get('intervalsCount')!.addValidators([Validators.required, Validators.min(0)])
                this.form.get('maxHeartRate')!.addValidators([Validators.min(0)])
                this.form.get('avgHeartRate')!.addValidators([Validators.min(0)])
                this.form.get('caloriesBurned')!.addValidators([Validators.min(0)])
            }

        })

        this.sets.valueChanges.subscribe(value => {
            if(value.length > 0)
            {

                this.tempWeight?.clearValidators()
                this.tempReps?.clearValidators()
                this.tempWeight?.patchValue(null);
                this.tempReps?.patchValue(null);

            }
        })
    }

    onClose() {
        this.close.emit();
    }

    get sets() {
        return this.form.get('sets') as FormArray
    }
    get tempReps() {
        return this.form.get('tempReps')
    }

    get tempWeight() {
        return this.form.get('tempWeight')
    }

    get isRepsInvalid() {
        return this.tempReps?.invalid && (this.tempReps?.touched || this.tempReps?.dirty)
    }

    get isWeightInvalid() {
        return this.tempWeight?.invalid && (this.tempWeight?.touched || this.tempWeight?.dirty)

    }

    createSetGroup(reps: number, weight: number): FormGroup {
        return this.fb.group({
            reps: [reps, [Validators.required, Validators.min(1)]],
            weight: [weight, [Validators.required]]
        })
    }

    addSet() {
        const reps = this.form.get('tempReps')?.value;
        const weight = this.form.get('tempWeight')?.value

        if(reps && weight) {
            this.sets.push(this.createSetGroup(reps, weight))
            this.form.get('tempWeight')?.reset()
            this.form.get('tempReps')?.reset()
            return;
        }
        this.form.invalid;

        console.log(this.sets.value)

    }

    removeSet(index: number) {
        return this.sets.removeAt(index);
    }

    createExerciseForm(): FormGroup {
        return this.fb.group({
            exerciseName: this.form.get('exerciseName')?.value,
            exerciseType: this.form.get('exerciseType')?.value,
            cardioType: this.form.get('cardioType')?.value,
            durationMinutes: this.form.get('durationMinutes')?.value,
            durationSeconds: this.form.get('durationSeconds')?.value,
            distance: this.form.get('distance')?.value,
            avgHeartRate: this.form.get('avgHeartRate')?.value,
            maxHeartRate: this.form.get('maxHeartRate')?.value,
            caloriesBurned: this.form.get('caloriesBurned')?.value,
            pace: this.form.get('pace')?.value,
            workInterval: this.form.get('workInterval')?.value,
            restInterval: this.form.get('restInterval')?.value,
            intervalsCount: this.form.get('intervalsCount')?.value,
            sets: this.fb.array(
                this.sets.controls.map(set =>
                    this.fb.group({
                        reps: set.get('reps')?.value,
                        weight: set.get('weight')?.value
                    })
                )
            )
        })
    }

    onSubmit() {
        console.log(this.form.value)
        if(this.form.invalid) {
            console.log("Exercise form is not valid")
            return;
        }
        const exerciseGroup = this.createExerciseForm();
        this.exercises.push(exerciseGroup)
        this.close.emit();
    }

}
