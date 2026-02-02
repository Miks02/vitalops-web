import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CardioType } from "../../pages/workout/models/CardioType";
import { ExerciseType } from "../../pages/workout/models/ExerciseType";
import { minArrayLength, onlyNumbersCheck } from "./FormHelpers";
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
    const today = new Date().toISOString().substring(0, 10);
    return fb.group({
        name: ['', Validators.required],
        workoutDate: [today, Validators.required],
        exercises: fb.array([], [minArrayLength(1)]),
        notes: ['', [Validators.maxLength(150)]]
    })
}

export function createWorkoutObject(form: FormGroup): CreateWorkoutDto {
    return {
        name: form.get('name')?.value,
        workoutDate: form.get('workoutDate')?.value,
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

export function createFullNameForm(fb: FormBuilder, firstName: string = '', lastName: string = ''): FormGroup {
    return fb.group({
        firstName: [firstName, [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
        lastName: [lastName, [Validators.required, Validators.minLength(2), Validators.maxLength(20)]]
    });
}

export function createDateOfBirthForm(fb: FormBuilder, dateOfBirth: string = ''): FormGroup {
    return fb.group({
        dateOfBirth: [dateOfBirth, Validators.required]
    });
}

export function createUsernameForm(fb: FormBuilder, username: string = ''): FormGroup {
    return fb.group({
        userName: [username, [Validators.required, Validators.minLength(4), Validators.maxLength(20)]]
    });
}

export function createEmailForm(fb: FormBuilder, email: string = ''): FormGroup {
    return fb.group({
        email: [email, [Validators.required, Validators.email]]
    });
}

export function createGenderForm(fb: FormBuilder, gender: number | null = null): FormGroup {
    return fb.group({
        gender: [gender, Validators.required]
    });
}

export function createWeightForm(fb: FormBuilder, weight: number | null = null): FormGroup {
    return fb.group({
        weight: [weight, [Validators.required, Validators.min(24), Validators.max(399)]]
    });
}

export function createHeightForm(fb: FormBuilder, height: number | null = null): FormGroup {
    return fb.group({
        height: [height, [Validators.required, Validators.min(69), Validators.max(249)]]
    });
}

export function createProfilePictureForm(fb: FormBuilder): FormGroup {
    return fb.group({
        profileImage: ['']
    });
}

export function createWeightEntryForm(fb: FormBuilder): FormGroup {
    return fb.group({
        weight: ['', [Validators.required, Validators.min(24), Validators.max(399), onlyNumbersCheck()]],
        time: ['', Validators.required],
        notes: ['', Validators.maxLength(100)]
    });
}

export function createTargetWeightForm(fb: FormBuilder): FormGroup {
    return fb.group({
        targetWeight: ['', [Validators.required, Validators.min(24), Validators.max(399), onlyNumbersCheck()]]
    })
}

export function createChangePasswordForm(fb: FormBuilder): FormGroup {
    return fb.group({
        currentPassword: ['', [Validators.required, Validators.minLength(6)]],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
}
