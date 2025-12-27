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
import { FormBuilder, FormsModule, Validators, ReactiveFormsModule, FormArray, FormGroup, RequiredValidator } from "@angular/forms";
import { ExerciseType } from '../models/ExerciseType';
import { CardioType } from '../models/CardioType';
import { clearValidators, onlyNumbersCheck, minArrayLength, clearFormInputs, addValidators } from '../../../core/helpers/FormHelpers';
import { createExerciseForm } from '../../../core/helpers/Factories';
import { Subject, takeUntil } from 'rxjs';


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

    private destroy$ = new Subject<void>();

    form = createExerciseForm(this.fb)

    get sets() { return this.form.get('sets') as FormArray }
    get tempReps() { return this.form.get('tempReps') }
    get tempWeight() { return this.form.get('tempWeight') }

    ngOnInit() {
        this.initializeForm();
        this.handleExerciseTypeChange();
        this.handleCardioTypeChange();
        this.handleSetsChange();
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onClose() {
        this.close.emit();
    }

    isControlInvalid(control: string): boolean | undefined {
        const c = this.form.get(control);
        return c?.invalid && (c?.touched || c.dirty)
    }

    createSetGroup(reps: number, weight: number): FormGroup {
        return this.fb.group({
            reps: [reps, [Validators.required, Validators.min(1)]],
            weight: [weight, [Validators.required, Validators.min(1)]]
        })
    }

    addSet() {
        const reps = this.form.get('tempReps')?.value;
        const weight = this.form.get('tempWeight')?.value

        if(this.tempWeight?.invalid || this.tempReps?.invalid) {
            this.tempWeight?.markAsTouched();
            this.tempReps?.markAsTouched();
            return;
        }
        this.sets.push(this.createSetGroup(reps, weight))
    }

    removeSet(index: number) {
        return this.sets.removeAt(index);
    }

    onSubmit() {
        console.log(this.form.value)
        if(this.form.invalid) {
            console.log("Exercise form is not valid")
            return;
        }
        const exerciseGroup = this.createExerciseGroup();
        this.exercises.push(exerciseGroup)
        this.close.emit();
    }


    private initializeForm() {
        if(this.form.get('exerciseType')?.value === ExerciseType.Weights || this.form.get('exerciseType')?.value === ExerciseType.Bodyweight) {
            this.tempWeight?.addValidators([Validators.required, Validators.min(1), onlyNumbersCheck()])
            this.tempReps?.addValidators([Validators.required, Validators.min(1), onlyNumbersCheck()])
        }
    }



    private handleExerciseTypeChange() {
        this.form.get('exerciseType')!.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(type => {
            if(type === ExerciseType.Cardio) {
                this.sets.clear();
                this.form.get('cardioType')?.patchValue(CardioType.SteadyState)
                clearValidators(['tempWeight', 'tempReps', 'sets'], this.form)
                clearFormInputs(['tempWeight', 'tempReps'], this.form)
                console.log("kurac")
                return;
            }
            if(type === ExerciseType.Weights || type === ExerciseType.Bodyweight) {
                addValidators(['tempWeight', 'tempReps'], this.form, [Validators.required, Validators.min(0), onlyNumbersCheck()])
                this.sets.addValidators(minArrayLength(1))
                this.sets.updateValueAndValidity();
                this.clearCardioInputs();
                this.clearCardioValidators();
                return;
            }
        })
    }

    private handleCardioTypeChange() {
        this.form.get('cardioType')!.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(type => {
            this.clearCardioInputs();
            this.clearCardioValidators();
            if(type === CardioType.SteadyState) {
                this.addSteadyStateCardioValidators();
                return;
            }
            if(type === CardioType.Hiit) {
                this.addHiitCardioValidators();
                return;
            }



        })
    }

    private handleSetsChange() {
        this.sets.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(value => {
            if(value.length > 0) {
                this.tempReps?.reset();
                this.tempWeight?.reset();
                clearValidators(['tempWeight', 'tempReps'], this.form);
            }
        })
    }
    private createExerciseGroup(): FormGroup {

        const formValue = {...this.form.value}
        delete formValue.tempWeight
        delete formValue.tempReps

        return this.fb.group({
            ...formValue,
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

    private clearCardioValidators() {
        const cardioFields: string[] =
        ['cardioType', 'durationMinutes', 'durationSeconds', 'pace', 'distance', 'avgHeartRate', 'caloriesBurned', 'workInterval', 'restInterval', 'maxHeartRate', 'intervalsCount']

        clearValidators(cardioFields, this.form);
    }

    private clearCardioInputs() {
        const cardioFields: string[] =
        ['durationMinutes', 'durationSeconds', 'pace', 'distance', 'avgHeartRate', 'caloriesBurned', 'workInterval', 'restInterval', 'maxHeartRate', 'intervalsCount']

        clearFormInputs(cardioFields, this.form);
    }

    private addSteadyStateCardioValidators() {
        addValidators(
            ['cardioType', 'durationMinutes', 'durationSeconds'],
            this.form,
            [Validators.required, Validators.min(0)]
        )

        addValidators(['pace', 'distance', 'avgHeartRate', 'caloriesBurned'], this.form, [Validators.min(0)])
    }

    private addHiitCardioValidators() {
        addValidators(
            ['cardioType', 'workInterval', 'restInterval', 'intervalsCount'],
            this.form,
            [Validators.required, Validators.min(0)]
        )

        addValidators(['maxHeartRate', 'avgHeartRate', 'caloriesBurned'], this.form, [Validators.min(0)])
    }
}
