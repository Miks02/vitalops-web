import { Component } from '@angular/core';
import { NgIcon, provideIcons } from "@ng-icons/core";
import { faSolidUser, faSolidBookOpen, faSolidChartLine, faSolidGear, faSolidDumbbell, faSolidBowlRice, faSolidArrowUpRightDots, faSolidMoon, faSolidCircleChevronLeft, faSolidRightToBracket} from '@ng-icons/font-awesome/solid';

@Component({
    selector: 'app-sidebar',
    imports: [NgIcon],
    templateUrl: './sidebar.html',
    styleUrl: './sidebar.css',
    providers: [provideIcons({faSolidUser, faSolidChartLine, faSolidGear, faSolidBookOpen, faSolidDumbbell, faSolidBowlRice, faSolidArrowUpRightDots, faSolidMoon, faSolidCircleChevronLeft, faSolidRightToBracket})]
})
export class Sidebar {

}
