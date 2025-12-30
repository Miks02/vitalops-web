import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIcon, provideIcons } from "@ng-icons/core";
import {
  faSolidUser,
  faSolidBookOpen,
  faSolidChartLine,
  faSolidGear,
  faSolidDumbbell,
  faSolidBowlRice,
  faSolidArrowUpRightDots,
  faSolidMoon,
  faSolidCircleChevronLeft,
  faSolidRightToBracket
} from "@ng-icons/font-awesome/solid";
import { RouterLink } from "@angular/router";

@Component({
    selector: 'app-sidebar',
    imports: [NgIcon, RouterLink],
    templateUrl: './sidebar.html',
    styleUrl: './sidebar.css',
    providers: [provideIcons({faSolidUser, faSolidChartLine, faSolidGear, faSolidBookOpen, faSolidDumbbell, faSolidBowlRice, faSolidArrowUpRightDots, faSolidMoon, faSolidCircleChevronLeft, faSolidRightToBracket})]
})
export class Sidebar {
    @Input()
    isOpen: boolean = false;

    @Output()
    close = new EventEmitter<void>();
    @Output()
    logout = new EventEmitter<void>();

    onSidebarClose() {
        this.close.emit();
    }

    onLogout() {
        this.logout.emit();
    }

}
