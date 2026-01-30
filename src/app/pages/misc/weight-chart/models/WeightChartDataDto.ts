import { WeightEntryDetailsDto } from "../../../weight/models/WeightEntryDetailsDto";

export type WeightChartDataDto = {
    entries: WeightEntryDetailsDto[];
    targetWeight: number | null;
}
