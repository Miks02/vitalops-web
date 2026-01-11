import { Routes } from '@angular/router';
import { AuthLayout } from './auth/auth-layout/auth-layout';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { Dashboard } from './pages/dashboard/dashboard';
import { AppLayout } from './layout/app-layout/app-layout';
import { WorkoutList } from './pages/workout/workout-list/workout-list';
import { authGuard } from './core/guards/auth-guard';
import { guestGuard } from './core/guards/guest-guard';
import { WorkoutForm } from './pages/workout/workout-form/workout-form';
import { ProfilePage } from './pages/profile/profile-page/profile-page';

export const routes: Routes = [
    {
        path: "",
        canActivate: [authGuard],
        component: AppLayout,
        children: [
            {
                path: "",
                redirectTo: "dashboard",
                pathMatch: "full"
            },
            {
                path: "dashboard",
                component: Dashboard
            },
            {
                path: "workouts",
                component: WorkoutList
            },
            {
                path: "workout-form",
                component: WorkoutForm
            },
            {
                path: "profile",
                component: ProfilePage
            }
        ]
    },
    {
        path: "",
        canActivate: [guestGuard],
        component: AuthLayout,
        children: [
            {
                path: "",
                redirectTo: "login",
                pathMatch: "full"
            },
            {
                path: "login",
                component: Login
            },
            {
                path: "register",
                component: Register
            }
        ]
    }
];
