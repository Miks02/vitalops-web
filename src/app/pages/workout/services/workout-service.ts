import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { Workout } from '../models/Workout';
import { CreateWorkoutDto } from '../models/CreateWorkoutDto';

@Injectable({
    providedIn: 'root',
})
export class WorkoutService {
    private exercisesSubject = new BehaviorSubject<Workout[]>([]);
    exercises$ = this.exercisesSubject.asObservable();

    addWorkout(model: CreateWorkoutDto): Observable<CreateWorkoutDto> {
        return of(model).pipe(
            tap(workout => {
                const current = this.exercisesSubject.value
                const newWorkout: Workout =
                {
                    id: this.generateMockWorkoutId(this.exercisesSubject.value),
                    ...workout,
                    createdAt: new Date().toISOString()
                }

                this.exercisesSubject.next([...current, newWorkout])
            })

        )

    }

    getWorkouts(): Observable<Workout[]> {
        return this.exercises$;
    }

    private generateMockWorkoutId(workouts: Workout[]) {
        return workouts.length ? Math.max(...workouts.map(w => w.id)) + 1 : 1
    }



}
