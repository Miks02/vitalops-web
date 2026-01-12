import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, tap } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { ProfilePageDto } from '../models/ProfilePageDto';
import { ApiResponse } from '../../../core/models/ApiResponse';

@Injectable({
    providedIn: 'root',
})
export class ProfileService {
    private api = environment.apiUrl;

    private http = inject(HttpClient);

    private profilePageSubject = new BehaviorSubject<ProfilePageDto | undefined>(undefined);
    public profilePage$ = this.profilePageSubject.asObservable();

    getProfilePage() {
        return this.http.get<ProfilePageDto>(`${this.api}/profile`).pipe(
            tap(res => {
                this.profilePageSubject.next(res)
            }),
            
        );
    }
}
