import { PagedResult } from "../../../core/models/PagedResult"
import { WorkoutListItemDto } from "./WorkoutListItemDto"
import { WorkoutSummaryDto } from "./WorkoutSummaryDto"

export type WorkoutPageDto = {
    pagedWorkouts: PagedResult<WorkoutListItemDto>,
    workoutSummary: WorkoutSummaryDto
}
