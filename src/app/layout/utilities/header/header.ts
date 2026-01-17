import { Component, inject, Input, Signal, signal, WritableSignal } from '@angular/core';
import { LayoutState } from '../../services/layout-state';
import { Title } from '@angular/platform-browser';
import { RouterLink } from "@angular/router";

@Component({
    selector: 'app-header',
    imports: [RouterLink],
    templateUrl: './header.html',
    styleUrl: './header.css',
})
export class Header {
    @Input()
    fullName: Signal<string | null> = signal("rar");

    title: string = ""
    subtitle: string = "Welcome back! Ready for the next workout ?"

    layoutState = inject(LayoutState);
    browserTitle = inject(Title)

    ngOnInit() {
        this.layoutState.getTitle().subscribe(res => {
            this.title = res
            this.browserTitle.setTitle("VitalOps | " + this.title);
        })

    }


}
