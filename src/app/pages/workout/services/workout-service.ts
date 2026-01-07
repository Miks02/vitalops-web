import { inject, Injectable, } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { CreateWorkoutDto } from '../models/CreateWorkoutDto';
import { PagedResult } from '../../../core/models/PagedResult';
import { WorkoutDetailsDto } from '../models/WorkoutDetailsDto';
import { HttpClient, HttpParams } from '@angular/common/http';
import { WorkoutListItemDto } from '../models/WorkoutListItemDto';
import { ApiResponse } from '../../../core/models/ApiResponse';
import { WorkoutPageDto } from '../models/WorkoutPageDto';
import { WorkoutSummaryDto } from '../models/WorkoutSummaryDto';
import { QueryParams } from '../../../core/models/QueryParams';

@Injectable({
    providedIn: 'root',
})
export class WorkoutService {
    private readonly api: string = "https://localhost:7263/api";
    private pagedWorkoutsSubject = new BehaviorSubject<PagedResult<WorkoutListItemDto>>(
        {items: [], totalCount: 0, page: 1, pageSize: 12, totalCountPaginated: 0}
    );
    private workoutSummarySubject = new BehaviorSubject<WorkoutSummaryDto | undefined>(undefined)
    private queryParams = new BehaviorSubject<QueryParams>(
        {sort: "", search: "", date: "", page: 1}
    )

    pagedWorkouts$ = this.pagedWorkoutsSubject.asObservable();
    workoutSummary$ = this.workoutSummarySubject.asObservable();

    private http = inject(HttpClient)

    getQueryParams() {return this.queryParams.value}
    setQueryParams(queryParams: QueryParams) {this.queryParams.next(queryParams)}

    getUserWorkoutsPage(): Observable<WorkoutPageDto> {
        const params = this.getHttpQueryParams();

        return this.http.get<ApiResponse<WorkoutPageDto>>(`${this.api}/workout/overview`, {params}).pipe(
            tap(res => {
                this.pagedWorkoutsSubject.next(res.data.pagedWorkouts)
                this.workoutSummarySubject.next(res.data.workoutSummary)
            }),
            map(res => res.data)
        );
    }

    getUserWorkoutsByQuery(): Observable<PagedResult<WorkoutListItemDto>> {
        const params = this.getHttpQueryParams();

        return this.http.get<ApiResponse<PagedResult<WorkoutListItemDto>>>(`${this.api}/workout`, {params})
            .pipe(
                tap(res => {
                     this.pagedWorkoutsSubject.next(res.data)
                }),
                 map(res => res.data)
            )
    }

    addWorkout(model: CreateWorkoutDto): Observable<WorkoutDetailsDto> {
        return this.http.post<WorkoutDetailsDto>(`${this.api}/workout`, model).pipe(
            tap(res => console.log(res))
        )

    }

    deleteWorkout(id: number): Observable<ApiResponse<void>> {
        return this.http.delete<ApiResponse<void>>(`${this.api}/workout/delete/${id}`).pipe(
            tap(res => console.log("Delete response: ", res))
        )
    }

    private getHttpQueryParams(): HttpParams {
        const queryParams = this.getQueryParams();

        return new HttpParams()
            .set('sortBy', queryParams.sort)
            .set('searchBy', queryParams.search)
            .set('date', queryParams.date)
            .set('page', queryParams.page)
    }

}
