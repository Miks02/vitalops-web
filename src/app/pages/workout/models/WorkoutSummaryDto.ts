import { ExerciseType } from "./ExerciseType"

export type WorkoutSummaryDto = {
    exerciseCount: number,
    lastWorkoutDate: string,
    favoriteExerciseType: ExerciseType
}
