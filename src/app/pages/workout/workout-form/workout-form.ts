import { Component, inject } from '@angular/core';
import { NgIcon, provideIcons } from "@ng-icons/core";
import { faSolidCalendarDay, faSolidTag } from '@ng-icons/font-awesome/solid';
import { LayoutState } from '../../../layout/services/layout-state';

@Component({
  selector: 'app-workout-form',
  imports: [NgIcon],
  templateUrl: './workout-form.html',
  styleUrl: './workout-form.css',
  providers: [provideIcons({faSolidTag, faSolidCalendarDay})]
})
export class WorkoutForm {

    layoutState = inject(LayoutState)

    ngOnInit() {
        this.layoutState.setTitle("Workout Form")
    }

}
