import { Component } from '@angular/core';
import { provideIcons, NgIcon } from '@ng-icons/core';
import {
  faSolidBars,
  faSolidBowlRice,
  faSolidChartLine,
  faSolidDumbbell,
  faSolidGear,
  faSolidUser
} from "@ng-icons/font-awesome/solid";
import { RouterLink } from "@angular/router";

@Component({
    selector: 'app-bottom-nav',
    imports: [NgIcon, RouterLink],
    templateUrl: './bottom-nav.html',
    styleUrl: './bottom-nav.css',
    providers: [provideIcons({faSolidUser, faSolidChartLine, faSolidBars, faSolidBowlRice, faSolidDumbbell, faSolidGear})]

})
export class BottomNav {

}
