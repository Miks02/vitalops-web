import { Routes } from '@angular/router';
import { AuthLayout } from './auth/auth-layout/auth-layout';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';

export const routes: Routes = [
    {
        path: "auth",
        component: AuthLayout,
        children: [
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
