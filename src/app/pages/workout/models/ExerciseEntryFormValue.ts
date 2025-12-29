import { CardioType } from "./CardioType"
import { ExerciseType } from "./ExerciseType"
import { SetEntry } from "./SetEntry"


export type ExerciseEntryFormValue = {
    exerciseName: string,
    exerciseType: ExerciseType,
    cardioType: CardioType,
    durationMinutes: number,
    durationSeconds: number,
    distance?: number,
    avgHeartRate?: number,
    maxHeartRate?: number,
    caloriesBurned?: number,
    pace: number,
    workInterval: number,
    restInterval: number,
    intervalsCount: number,
    sets: SetEntry[]
}
