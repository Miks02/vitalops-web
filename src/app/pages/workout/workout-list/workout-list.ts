import { Component, computed, effect, inject, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { debounceTime, distinctUntilChanged, map, Subject, take, takeUntil, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
    faSolidChevronLeft,
    faSolidChevronRight,
    faSolidChildReaching,
    faSolidDumbbell,
    faSolidPersonRunning
} from '@ng-icons/font-awesome/solid';
import { LayoutState } from '../../../layout/services/layout-state';
import { WorkoutService } from '../services/workout-service';
import { WorkoutListItemDto } from '../models/WorkoutListItemDto';
import { NotificationService } from '../../../core/services/notification-service';
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';

@Component({
    selector: 'app-workout-list',
    imports: [RouterLink, DatePipe, FormsModule, NgIcon, NgxSkeletonLoaderComponent],
    templateUrl: './workout-list.html',
    styleUrl: './workout-list.css',
    providers: [
        provideIcons({
            faSolidChevronRight,
            faSolidChevronLeft,
            faSolidDumbbell,
            faSolidPersonRunning,
            faSolidChildReaching
        })
    ]
})
export class WorkoutList {
    layoutState = inject(LayoutState);
    workoutService = inject(WorkoutService);
    notificationService = inject(NotificationService);
    router = inject(Router);
    activatedRoute = inject(ActivatedRoute);

    private destroy$ = new Subject<void>();
    private search$ = new Subject<string>();

    isLoaded: WritableSignal<boolean> = signal(false);
    selectedWorkout: WorkoutListItemDto | null = null;

    queryParams = toSignal(this.activatedRoute.queryParams);
    workoutSummarySource = toSignal(this.workoutService.workoutSummary$, {initialValue: null});
    workoutsSource = toSignal(this.workoutService.pagedWorkouts$,{ initialValue: null });

    page: number = 1;
    search: string = '';
    sort: string = 'Newest';
    date: string = '';

    totalCount = computed(() => this.workoutsSource()?.totalCount);
    pageSize = computed(() => this.workoutsSource()?.pageSize);

    constructor() {
        effect(() => {
            this.page = this.workoutsSource()?.page ?? 1
        })
    }

    workoutList = computed(() => this.workoutsSource()?.items)
    workoutSummary = computed(() => this.workoutSummarySource())

    totalPages = computed(() => {
        if (this.totalCount() === undefined || this.pageSize() === undefined)
            return 0;
        return Math.ceil(this.totalCount()! / this.pageSize()!);
    });

    ngOnInit() {
        this.layoutState.setTitle('Workouts');
        this.readQueryParams();

        this.search$
        .pipe(
            debounceTime(300),
            distinctUntilChanged(),
            takeUntil(this.destroy$)
        )
        .subscribe(search => {
            this.updateQueryParams({ search, page: 1 });
        });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    readQueryParams() {
        return this.activatedRoute.queryParams
        .pipe(takeUntil(this.destroy$))
        .subscribe(params => {
            this.page = params['page'] ? +params['page'] : 1;
            this.search = params['search'] || '';
            this.sort = params['sort'] || 'Newest';
            this.date = params['date'] || '';

            this.workoutService.setQueryParams({
                sort: this.sort,
                search: this.search,
                date: this.date,
                page: this.page
            });

            if (!this.isLoaded()) {
                this.isLoaded.set(true);
                this.loadWorkoutSummary();
                return;
            }
            this.loadWorkouts();
        });
    }

    updateQueryParams(params: Partial<{ page: number; search: string; sort: string; date: string }>) {
        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: params,
            queryParamsHandling: 'merge'
        });
    }

    loadWorkoutSummary() {
        this.workoutService.getUserWorkoutsPage()
        .pipe(take(1))
        .subscribe();
    }

    loadWorkouts() {
        this.workoutService
        .getUserWorkoutsByQuery()
        .pipe(take(1))
        .subscribe();
    }

    loadWorkoutsByQuery(resetPage: boolean = false) {
        const params: any = {
            sort: this.sort,
            search: this.search,
            date: this.date,
            page: resetPage ? 1 : this.page
        };

        this.updateQueryParams(params);
    }

    onSearchChange(value: string) {
        this.search$.next(value);
    }

    onSortChange() {
        this.updateQueryParams({ sort: this.sort, page: 1 });
    }

    onDateChange() {
        this.updateQueryParams({ date: this.date, page: 1 });
    }

    getPreviousPage() {
        this.updateQueryParams({ page: this.page - 1 });
    }

    getNextPage() {
        this.updateQueryParams({ page: this.page + 1 });
    }

    getWorkoutDetails(id: number) {
        this.router.navigate(['/workouts', id])
    }

    getWorkoutCardClass() {

        return this.workoutList()?.length! < 2
        ? 'w-full'
        : 'w-full md:w-[calc(50%-0.375rem)]';
    }

}
