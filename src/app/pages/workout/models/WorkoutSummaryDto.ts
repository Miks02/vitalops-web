import { ExerciseType } from "./ExerciseType"

export type WorkoutSummaryDto = {
    workoutCount: number,
    exerciseCount: number,
    lastWorkoutDate: string,
    favoriteExerciseType: ExerciseType
}
