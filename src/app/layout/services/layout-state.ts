import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LayoutState {
    private titleSubject = new BehaviorSubject<string>("Title");
    public titleSubject$ = this.titleSubject.asObservable();

    setTitle(title: string) {
        this.titleSubject.next(title)
    }

    getTitle() {
        return this.titleSubject$
    }


}
