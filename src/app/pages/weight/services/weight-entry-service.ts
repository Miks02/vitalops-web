import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UserService } from '../../../core/services/user-service';
import { WeightCreateRequestDto } from '../models/WeightCreateRequestDto';
import { environment } from '../../../../environments/environment.development';
import { WeightEntryDetailsDto } from '../models/WeightEntryDetailsDto';
import { BehaviorSubject, tap } from 'rxjs';
import { WeightSummaryDto } from '../models/WeightSummaryDto';
import { PagedResult } from '../../../core/models/PagedResult';

@Injectable({
  providedIn: 'root',
})
export class WeightEntryService {
    private api = environment.apiUrl;

    private http = inject(HttpClient);
    private userService = inject(UserService);

    private weightSummarySubject = new BehaviorSubject<WeightSummaryDto | undefined>(undefined);
    private pagedWeightEntriesSubject = new BehaviorSubject<PagedResult<WeightEntryDetailsDto> | undefined>(undefined);

    weightSummary$ = this.weightSummarySubject.asObservable();
    pagedWeightEntries$ = this.pagedWeightEntriesSubject.asObservable();

    set weightSummary(summary: Partial<WeightSummaryDto>) {
        const current = this.weightSummarySubject.getValue() as WeightSummaryDto;
        this.weightSummarySubject.next({...current, ...summary})
    }

    getMyWeightSummary() {
        return this.http.get<WeightSummaryDto>(`${this.api}/weight-entries`)
            .pipe(
                tap(res => {
                    this.weightSummary = {
                        firstEntry: res.firstEntry,
                        currentWeight: res.currentWeight,
                        progress: res.progress
                    }
                    this.userService.userDetails = {currentWeight: res.currentWeight.weight}
                })
            )
    }

    addWeightEntry(request: WeightCreateRequestDto) {
        return this.http.post<WeightEntryDetailsDto>(`${this.api}/weight-entries`, request)

    }

}
