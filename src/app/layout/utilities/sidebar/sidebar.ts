import { Component } from '@angular/core';
import { NgIcon, provideIcons } from "@ng-icons/core";
import { faSolidUser, faSolidBook, faSolidChartLine, faSolidGear, faSolidDumbbell, faSolidFireFlameCurved} from '@ng-icons/font-awesome/solid';

@Component({
    selector: 'app-sidebar',
    imports: [NgIcon],
    templateUrl: './sidebar.html',
    styleUrl: './sidebar.css',
    providers: [provideIcons({faSolidUser, faSolidChartLine, faSolidGear, faSolidBook, faSolidDumbbell, faSolidFireFlameCurved})]
})
export class Sidebar {

}
