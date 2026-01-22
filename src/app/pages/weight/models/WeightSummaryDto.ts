import { WeightEntryDetailsDto } from "./WeightEntryDetailsDto"
import { WeightRecordDto } from "./WeightRecordDto"

export type WeightSummaryDto = {
    firstEntry: WeightRecordDto,
    currentWeight: WeightRecordDto,
    progress: number,
    weightEntries: WeightEntryDetailsDto[]
}
