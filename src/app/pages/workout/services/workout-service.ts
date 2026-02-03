import { inject, Injectable, } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { CreateWorkoutDto } from '../models/CreateWorkoutDto';
import { PagedResult } from '../../../core/models/PagedResult';
import { WorkoutDetailsDto } from '../models/WorkoutDetailsDto';
import { HttpClient, HttpParams } from '@angular/common/http';
import { WorkoutListItemDto } from '../models/WorkoutListItemDto';
import { WorkoutPageDto } from '../models/WorkoutPageDto';
import { WorkoutSummaryDto } from '../models/WorkoutSummaryDto';
import { QueryParams } from '../../../core/models/QueryParams';
import { WorkoutsPerMonthDto } from '../models/WorkoutsPerMonthDto';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class WorkoutService {
    private readonly api: string = environment.apiUrl;
    private pagedWorkoutsSubject = new BehaviorSubject<PagedResult<WorkoutListItemDto>>(
        {items: [], totalCount: 0, page: 0, pageSize: 0, totalCountPaginated: 0}
    );
    private workoutSummarySubject = new BehaviorSubject<WorkoutSummaryDto | undefined>(undefined)
    private queryParams = new BehaviorSubject<QueryParams>(
        {sort: "", search: "", date: "", page: 1}
    )
    private workoutCountsSubject = new BehaviorSubject<WorkoutsPerMonthDto | null>(null)

    pagedWorkouts$ = this.pagedWorkoutsSubject.asObservable();
    workoutSummary$ = this.workoutSummarySubject.asObservable();
    workoutCounts$ = this.workoutCountsSubject.asObservable();

    private http = inject(HttpClient)

    getQueryParams() {return this.queryParams.value}
    setQueryParams(queryParams: QueryParams) {this.queryParams.next(queryParams)}

    getUserWorkoutsPage(): Observable<WorkoutPageDto> {
        const params = this.getHttpQueryParams();

        return this.http.get<WorkoutPageDto>(`${this.api}/workouts/overview`, {params}).pipe(
            tap(res => {
                this.pagedWorkoutsSubject.next(res.pagedWorkouts)
                this.workoutSummarySubject.next(res.workoutSummary)
            }),
            map(res => res)
        );
    }

    getUserWorkoutsByQuery(): Observable<PagedResult<WorkoutListItemDto>> {
        const params = this.getHttpQueryParams();

        return this.http.get<PagedResult<WorkoutListItemDto>>(`${this.api}/workouts`, {params})
            .pipe(
                tap(res => {
                     this.pagedWorkoutsSubject.next(res)
                }),
                 map(res => res)
            )
    }

    getUserWorkout(id: number): Observable<WorkoutDetailsDto> {
        return this.http.get<WorkoutDetailsDto>(`${this.api}/workouts/${id}`);
    }

    getUserWorkoutCountsByMonth(year: number | null = null) {
        const params = new HttpParams().set('year', year?.toString()!)

        return this.http.get<WorkoutsPerMonthDto>(`${this.api}/workouts/workouts-per-month`, {params})
            .pipe(
                tap(res => this.workoutCountsSubject.next(res))
            )
    }

    addWorkout(model: CreateWorkoutDto): Observable<WorkoutDetailsDto> {
        return this.http.post<WorkoutDetailsDto>(`${this.api}/workouts`, model).pipe(
            tap(res => console.log(res))
        )

    }

    deleteWorkout(id: number): Observable<void> {
        return this.http.delete<void>(`${this.api}/workouts/${id}`).pipe(
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
