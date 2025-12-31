import { Component, inject } from '@angular/core';
import { LayoutState } from '../../../layout/services/layout-state';
import { RouterLink } from "@angular/router";
import { WorkoutService } from '../services/workout-service';
import { WorkoutDetailsDto } from '../models/WorkoutDetailsDto';
import { WorkoutListItemDto } from '../models/WorkoutListItemDto';

@Component({
    selector: 'app-workout-list',
    imports: [RouterLink],
    templateUrl: './workout-list.html',
    styleUrl: './workout-list.css',
})
export class WorkoutList {
    layoutState = inject(LayoutState)
    workoutService = inject(WorkoutService)

    workouts: WorkoutDetailsDto[] = []
    page: number = 1;
    pageSize: number = 12;
    workoutList: WorkoutListItemDto[] = this.fillWorkoutList();


    ngOnInit() {
        this.layoutState.setTitle("Workouts")
        this.workoutService.getWorkouts()?.subscribe(res => this.workouts = res?.items!);
    }

    getWorkoutCardClass() {
        if(this.workoutList.length < 2) {
            return 'w-full'
        }

        return 'w-full md:w-[calc(50%-0.375rem)]'
    }

    getsetBadgeClass(sets: number): string {
        if (sets >= 28) return 'bg-yellow-400';
        if (sets >= 24) return 'bg-yellow-400';
        if (sets >= 20) return 'bg-blue-400';
        return 'bg-emerald-400';
    }

    private fillWorkoutList(): WorkoutListItemDto[] {
        return [
        {
            id: 1,
            name: "Chest/Biceps",
            exerciseCount: 6,
            workoutDate: "30.12.2025",
            setCount: 24
        },
        {
            id: 2,
            name: "Back/triceps",
            exerciseCount: 6,
            workoutDate: "30.12.2025",
            setCount: 28
        },
        {
            id: 3,
            name: "Shoulders",
            exerciseCount: 6,
            workoutDate: "30.12.2025",
            setCount: 20
        },
        {
            id: 4,
            name: "Legs/Abs",
            exerciseCount: 7,
            workoutDate: "30.12.2025",
            setCount: 30
        },
        {
            id: 5,
            name: "Chest/Biceps",
            exerciseCount: 6,
            workoutDate: "30.12.2025",
            setCount: 24
        },
        {
            id:6,
            name: "Back/triceps",
            exerciseCount: 6,
            workoutDate: "30.12.2025",
            setCount: 28
        },
        {
            id: 7,
            name: "Shoulders",
            exerciseCount: 6,
            workoutDate: "30.12.2025",
            setCount: 20
        },
        {
            id: 8,
            name: "Legs/Abs",
            exerciseCount: 7,
            workoutDate: "30.12.2025",
            setCount: 30
        },
    ]
    }


}
