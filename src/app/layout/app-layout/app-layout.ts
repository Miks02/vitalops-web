import { Component, inject, Output } from '@angular/core';
import { Sidebar } from '../utilities/sidebar/sidebar';
import { Header } from '../utilities/header/header';
import { Router, RouterOutlet } from "@angular/router";
import { BottomNav } from "../utilities/bottom-nav/bottom-nav";
import { AuthService } from '../../core/services/auth-service';

@Component({
    selector: 'app-app-layout',
    imports: [Sidebar, Header, RouterOutlet, BottomNav],
    templateUrl: './app-layout.html',
    styleUrl: './app-layout.css',


})
export class AppLayout {

    authService = inject(AuthService)
    router = inject(Router)

    isSidebarOpen: boolean = false;

    closeSidebar() {
        this.isSidebarOpen = false;
    }

    openSidebar() {
        this.isSidebarOpen = true;
    }

    logout() {
        this.authService.logout().subscribe({
            next: (res) => {
                this.router.navigate(['/login'])
                console.log(res)
            },
            error: (err) => {
                console.log(err);
            }
        });
    }

}
