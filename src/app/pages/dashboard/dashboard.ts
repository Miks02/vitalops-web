import { Component, computed, inject, signal, WritableSignal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { faSolidDumbbell, faSolidFireFlameCurved, faSolidGlassWater, faSolidMoon, faSolidScaleUnbalanced, faSolidUtensils, faSolidCalculator, faSolidGhost, faSolidMagnifyingGlassMinus, faSolidChartLine } from '@ng-icons/font-awesome/solid';
import {
    Chart, registerables
} from 'chart.js';
import { WorkoutsChart } from "../misc/workouts-chart/workouts-chart";
import { LayoutState } from '../../layout/services/layout-state';
import { take } from 'rxjs';
import { WeightChart } from "../misc/weight-chart/weight-chart";
import { RouterLink } from "@angular/router";
import { DashboardState } from './services/dashboard-state';
import { toSignal } from '@angular/core/rxjs-interop';
import { UserService } from '../../core/services/user-service';
import { DatePipe } from '@angular/common';
import { WorkoutService } from '../workout/services/workout-service';
import { FormsModule } from '@angular/forms';
Chart.register(...registerables)

@Component({
    selector: 'app-dashboard',
    imports: [NgIcon, WorkoutsChart, WeightChart, RouterLink, DatePipe, FormsModule],
    templateUrl: './dashboard.html',
    styleUrl: './dashboard.css',
    providers: [provideIcons({faSolidDumbbell, faSolidFireFlameCurved, faSolidGlassWater, faSolidMoon, faSolidScaleUnbalanced, faSolidUtensils, faSolidCalculator, faSolidGhost, faSolidChartLine})]
})
export class Dashboard {
    private layoutState = inject(LayoutState);
    private dashboardState = inject(DashboardState);
    private userService = inject(UserService);
    private workoutService = inject(WorkoutService);

    dashboardSource = toSignal(this.dashboardState.dashboard$, {initialValue: null})
    userSource = toSignal(this.userService.userDetails$, {initialValue: null})
    workoutsPerMonth = toSignal(this.workoutService.workoutCounts$, {initialValue: null});
    selectedYear: number | null = new Date().getFullYear();

    years = computed(() => this.workoutsPerMonth()?.years)

    ngOnInit() {
        this.layoutState.setTitle("Dashboard")
        this.loadDashboard();
        this.loadCounts();
    }

    loadDashboard() {
        return this.dashboardState.getDashboard()
        .pipe(take(1))
        .subscribe();
    }

    loadCounts(year: number | null = null) {
        return this.workoutService.getUserWorkoutCountsByMonth(year)
        .pipe(take(1))
        .subscribe();
    }

    getUserWeight() {
        const weight = this.userSource()?.weight
        if(weight)
            return weight + " KG"
        return "N/A"
    }

    getUserHeight() {
        const height = this.userSource()?.height;

        if(height)
            return height + " CM"
        return "N/A"
    }

    getUserAge() {
        const age = this.userSource()?.age;
        if(age)
            return age
        return "N/A"
    }

}
