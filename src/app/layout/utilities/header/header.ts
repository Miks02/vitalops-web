import { Component, inject, Input, Signal, signal, WritableSignal } from '@angular/core';
import { LayoutState } from '../../services/layout-state';
import { Title } from '@angular/platform-browser';
import { RouterLink } from "@angular/router";
import { Gender } from '../../../core/models/Gender';

@Component({
    selector: 'app-header',
    imports: [RouterLink],
    templateUrl: './header.html',
    styleUrl: './header.css',
})
export class Header {
    @Input()
    fullName: Signal<string | null> = signal(null);
    @Input()
    userImage: Signal<string> = signal("");
    @Input()
    userGender: Signal<Gender> = signal(Gender.Other);

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

    getProfileImageSrc(): string {
        console.log(this.userImage())
        if(this.userImage() !== "") return this.userImage();
        return this.userGender() === Gender.Male ? 'user_male.png' : (this.userGender() === Gender.Female ? 'user_female.png' : 'user_other.png');
    }


}
