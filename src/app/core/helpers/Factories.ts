import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CardioType } from "../../pages/workout/models/CardioType";
import { ExerciseType } from "../../pages/workout/models/ExerciseType";
import { minArrayLength } from "./FormHelpers";
import { ExerciseEntryFormValue } from "../../pages/workout/models/ExerciseEntryFormValue";
import { CreateWorkoutDto } from "../../pages/workout/models/CreateWorkoutDto";


export function createExerciseForm(fb: FormBuilder): FormGroup {
    return fb.group({
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
        sets: fb.array([], [minArrayLength(1)])
    })
}

export function createWorkoutForm(fb: FormBuilder): FormGroup {
    return fb.group({
        workoutName: ['', Validators.required],
        date: ['', Validators.required],
        exercises: fb.array([], [minArrayLength(1)]),
        notes: ['']
    })
}

export function  createWorkoutObject(form: FormGroup): CreateWorkoutDto {
        return {
            name: form.get('workoutName')?.value,
            workoutDate: form.get('date')?.value,
            notes: form.get('notes')?.value,
            exerciseEntries: (form.get('exercises')?.value as ExerciseEntryFormValue[]).map(exercise => ({
                name: exercise.exerciseName,
                exerciseType: exercise.exerciseType,
                cardioType: exercise.cardioType,
                durationMinutes: exercise.durationMinutes,
                durationSeconds: exercise.durationSeconds,
                distanceKm: exercise.distance,
                avgHeartRate: exercise.avgHeartRate,
                maxHeartRate: exercise.maxHeartRate,
                caloriesBurned: exercise.caloriesBurned,
                paceMinPerKm: exercise.pace,
                workIntervalSec: exercise.workInterval,
                restIntervalSec: exercise.restInterval,
                intervalsCount: exercise.intervalsCount,
                sets: exercise.sets
            }))
        }
    }
