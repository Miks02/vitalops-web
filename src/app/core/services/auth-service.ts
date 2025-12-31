import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { inject } from '@angular/core';
import { RegisterRequest } from '../models/RegisterRequest';
import { AuthResponse } from '../models/AuthResponse';
import { Observable, map, tap } from 'rxjs';
import { ApiResponse } from '../models/ApiResponse';
import { UserDto } from '../models/UserDto';
import { LoginRequest } from '../models/LoginRequest';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly api: string = "https://localhost:7263/api";
    private accessTokenSubject = new BehaviorSubject<string | null>(null);
    public accessToken$ = this.accessTokenSubject.asObservable();

    private readonly http = inject(HttpClient)

    get accessToken(): string | null {return this.accessTokenSubject.value}
    set accessToken(accessToken: string | null) {this.accessTokenSubject.next(accessToken)}

    register(model: RegisterRequest): Observable<UserDto> {
        return this.http.post<ApiResponse<AuthResponse>>(`${this.api}/auth/register`, model)
        .pipe(
            tap(res => this.accessToken = res.data.accessToken),
            map(res => res.data.user)
        )
    }

    login(model: LoginRequest): Observable<UserDto> {
        return this.http.post<ApiResponse<AuthResponse>>(`${this.api}/auth/login`, model)
        .pipe(
            tap(res => this.accessToken = res.data.accessToken),
            map(res => res.data.user),
            tap(res => console.log(res))
        )
    }

    logout(): Observable<ApiResponse<void>> {

        return this.http.post<ApiResponse<void>>(`${this.api}/auth/logout`, {})
        .pipe(
            tap(() => this.accessToken = null)
        )
    }

    test(): Observable<void> {
        return this.http.get<void>(`${this.api}/auth/test`).pipe(
            tap(res => console.log(res))
        );
    }


    isAuthenticated() {
        if(this.accessToken) return true
        return false;
    }



}
