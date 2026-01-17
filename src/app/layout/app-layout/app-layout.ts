import { Component, computed, inject, Output, Signal } from '@angular/core';
import { Sidebar } from '../utilities/sidebar/sidebar';
import { Header } from '../utilities/header/header';
import { Router, RouterOutlet } from "@angular/router";
import { BottomNav } from "../utilities/bottom-nav/bottom-nav";
import { AuthService } from '../../core/services/auth-service';
import { Subject, take, takeUntil, tap } from 'rxjs';
import { UserService } from '../../core/services/user-service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-app-layout',
    imports: [Sidebar, Header, RouterOutlet, BottomNav],
    templateUrl: './app-layout.html',
    styleUrl: './app-layout.css',
})
export class AppLayout {

    authService = inject(AuthService);
    userService = inject(UserService);
    router = inject(Router);

    user$ = toSignal(this.userService.userDetails$, {initialValue: null});

    private destroy$ = new Subject<void>();

    isSidebarOpen: boolean = false;
    fullName: Signal<string> = computed(() => this.user$()?.fullName ?? "");

    ngOnInit() {
        this.loadUser();
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    closeSidebar() {
        this.isSidebarOpen = false;
    }

    openSidebar() {
        this.isSidebarOpen = true;
    }

    logout() {
        this.authService.logout()
        .pipe(takeUntil(this.destroy$))
        .subscribe();
    }

    private loadUser() {
        return this.userService.getMe()
        .pipe(take(1))
        .subscribe();
    }

}
