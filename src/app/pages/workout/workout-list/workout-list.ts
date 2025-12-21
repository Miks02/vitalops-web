import { Component, inject } from '@angular/core';
import { LayoutState } from '../../../layout/services/layout-state';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-workout-list',
  imports: [RouterLink],
  templateUrl: './workout-list.html',
  styleUrl: './workout-list.css',
})
export class WorkoutList {
    layoutState = inject(LayoutState)

    ngOnInit() {
        this.layoutState.setTitle("Workouts")
    }
}
