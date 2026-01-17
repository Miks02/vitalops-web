import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { DashboardDto } from '../models/DashboardDto';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';

@Injectable({
    providedIn: 'root',
})
export class DashboardState {
    private api = environment.apiUrl;

    private dashboardSubject = new BehaviorSubject<DashboardDto | undefined>(undefined);
    public dashboard$ = this.dashboardSubject.asObservable();

    private http = inject(HttpClient);

    getDashboard() {
        return this.http.get<DashboardDto>(`${this.api}/dashboard`).pipe(
            tap((res) => this.dashboardSubject.next(res))
        )
    }

}
