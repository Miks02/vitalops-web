import { Component, inject, signal, WritableSignal } from '@angular/core';
import { LayoutState } from '../../../layout/services/layout-state';
import { RouterLink } from "@angular/router";
import { WorkoutService } from '../services/workout-service';
import { WorkoutListItemDto } from '../models/WorkoutListItemDto';
import { debounceTime, distinctUntilChanged, map, Subject, take, takeUntil, tap } from 'rxjs';
import {toSignal} from '@angular/core/rxjs-interop'
import { DatePipe } from "@angular/common";
import { Modal } from "../../../layout/utilities/modal/modal";
import { ModalData } from '../../../core/models/ModalData';
import { ModalType } from '../../../core/models/ModalType';
import { NotificationService } from '../../../core/services/notification-service';
import { FormsModule } from "@angular/forms";

@Component({
    selector: 'app-workout-list',
    imports: [RouterLink, DatePipe, Modal, FormsModule],
    templateUrl: './workout-list.html',
    styleUrl: './workout-list.css',
})
export class WorkoutList {
    layoutState = inject(LayoutState)
    workoutService = inject(WorkoutService)
    notificationService = inject(NotificationService)

    isModalOpen: WritableSignal<boolean> = signal(false);
    private destroy$ = new Subject<void>();
    private search$ = new Subject<string>();

    workouts = toSignal(this.workoutService.pagedWorkouts$
    .pipe(
        tap(res => {
            this.page = res.page;
        }),
        map(res => res.items)
    ), {initialValue: [] as WorkoutListItemDto[]})

    workoutSummary = toSignal(this.workoutService.workoutSummary$)

    page: number = this.workoutService.getQueryParams().page;
    search: string = this.workoutService.getQueryParams().search;
    sort: string = this.workoutService.getQueryParams().sort || "Newest";
    date: string = this.workoutService.getQueryParams().date;
    selectedWorkout: WorkoutListItemDto | null = null;

    ngOnInit() {
        this.layoutState.setTitle("Workouts")
        this.loadWorkouts();

        this.search$.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            takeUntil(this.destroy$)
        ).subscribe(search => {
            this.search = search;
            this.page = 1;
            this.loadWorkoutsByQuery();
        })
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    loadWorkouts() {
        this.workoutService.getUserWorkoutsPage()
        .pipe(take(1))
        .subscribe();
    }

    loadWorkoutsByQuery() {
        this.workoutService.setQueryParams({
            sort: this.sort,
            search: this.search,
            date: this.date,
            page: this.page,
        });

        this.workoutService.getUserWorkoutsByQuery()
        .pipe(take(1))
        .subscribe();
    }

    onSearchChange(value: string) {
        this.search$.next(value);
    }

    deleteWorkout(id: number) {
        this.workoutService.deleteWorkout(id).pipe(
            take(1)
        )
        .subscribe({
            next: () => {
                this.notificationService.showSuccess("Workout has been deleted successfully.")
                this.closeModal();
                this.loadWorkouts();
            }
        });
    }

    editWorkout(id: number) {

    }

    closeModal() {
        this.isModalOpen.set(false);
    }

    buildModal(): ModalData {
        const workoutDate: Date = new Date(this.selectedWorkout?.workoutDate as string)
        const userlocale = navigator.language;
        const formattedDate = new Intl.DateTimeFormat(userlocale, {
            year: 'numeric',
            month: "long",
            day: "numeric"
        }).format(workoutDate)

        return {
            title: `${this.selectedWorkout?.name} | ${formattedDate}`,
            subtitle: "Do you want to edit or delete this entry",
            type: ModalType.Question,
            primaryActionLabel: "Edit",
            secondaryActionLabel: "Delete",
            primaryAction: () => this.editWorkout(this.selectedWorkout!.id),
            secondaryAction: () => this.deleteWorkout(this.selectedWorkout!.id)
        }
    }

    getWorkoutCardClass() {
        if(this.workouts().length < 2) {
            return 'w-full'
        }

        return 'w-full md:w-[calc(50%-0.375rem)]'
    }

    getSetsBadgeClass(sets: number): string {
        if (sets >= 28) return 'bg-yellow-400';
        if (sets >= 24) return 'bg-yellow-400';
        if (sets >= 20) return 'bg-blue-400';
        return 'bg-emerald-400';
    }


}
