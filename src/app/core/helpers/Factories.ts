import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CardioType } from "../../pages/workout/models/CardioType";
import { ExerciseType } from "../../pages/workout/models/ExerciseType";
import { minArrayLength } from "./Validators";


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
