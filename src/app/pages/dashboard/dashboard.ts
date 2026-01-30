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
import { Router, RouterLink } from "@angular/router";
import { DashboardState } from './services/dashboard-state';
import { toSignal } from '@angular/core/rxjs-interop';
import { UserService } from '../../core/services/user-service';
import { DatePipe } from '@angular/common';
import { WorkoutService } from '../workout/services/workout-service';
import { FormsModule } from '@angular/forms';
import { Gender } from '../../core/models/Gender';
import { WeightEntryService } from '../weight/services/weight-entry-service';
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
    private weightService = inject(WeightEntryService);
    private router = inject(Router)

    dashboardSource = toSignal(this.dashboardState.dashboard$, {initialValue: null})
    userSource = toSignal(this.userService.userDetails$, {initialValue: null})
    workoutsPerMonth = toSignal(this.workoutService.workoutCounts$, {initialValue: null});
    weightChartSource = toSignal(this.weightService.weightChart$, {initialValue: null});

    selectedYear: number = new Date().getFullYear();

    years = computed(() => this.workoutsPerMonth()?.years)

    ngOnInit() {
        this.layoutState.setTitle("Dashboard")
        this.loadDashboard();
        this.loadCounts();
        this.loadWeightChart();
    }

    ngAfterViewInit() {
        setTimeout(() => {
            const elements = document.querySelectorAll('.typewriter');
            elements.forEach((el: any) => {
                el.style.setProperty('--target-width', el.scrollWidth + 'px');
            });
        }, 100);
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

    loadWeightChart() {
        const targetWeight = this.userSource()?.targetWeight;
        return this.weightService.getMyWeightChart(targetWeight)
        .pipe(take(1))
        .subscribe();
    }

    getToWorkout(id: number) {
        this.router.navigate(['/workouts/', id])
    }

    getUserWeight() {
        const weight = this.userSource()?.currentWeight
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

    getProfileImageSrc(): string {
        if ((this.userSource as any).profileImage)
            return (this.userSource as any).profileImage;
        return this.userSource()?.gender === Gender.Male ? 'user_male.png' : (this.userSource()?.gender === Gender.Female ? 'user_female.png' : 'user_other.png');
    }

}
