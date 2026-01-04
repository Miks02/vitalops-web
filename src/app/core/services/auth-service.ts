import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { RegisterRequest } from '../models/RegisterRequest';
import { AuthResponse } from '../models/AuthResponse';
import { Observable, map, tap } from 'rxjs';
import { ApiResponse } from '../models/ApiResponse';
import { UserDto } from '../models/UserDto';
import { LoginRequest } from '../models/LoginRequest';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly api: string = "https://localhost:7263/api";
    private accessTokenSubject = new BehaviorSubject<string | null>(null);
    public accessToken$ = this.accessTokenSubject.asObservable();

    private userSubject = new BehaviorSubject<UserDto | null>(null);
    public user$ = this.userSubject.asObservable();

    private readonly http = inject(HttpClient)
    private router = inject(Router);

    get accessToken(): string | null {return this.accessTokenSubject.value}
    set accessToken(accessToken: string | null) {this.accessTokenSubject.next(accessToken)}

    register(model: RegisterRequest): Observable<UserDto> {
        return this.http.post<ApiResponse<AuthResponse>>(`${this.api}/auth/register`, model)
        .pipe(
            tap(res => {
                this.accessTokenSubject.next(res.data.accessToken);
                this.userSubject.next(res.data.user);
            }),
            map(res => res.data.user)
        )
    }

    login(model: LoginRequest): Observable<UserDto> {
        return this.http.post<ApiResponse<AuthResponse>>(`${this.api}/auth/login`, model)
        .pipe(
            tap(res => {
                this.accessTokenSubject.next(res.data.accessToken);
                this.userSubject.next(res.data.user);
                this.router.navigate(['/dashboard']);
            }),
            map(res => res.data.user),
        )
    }

    logout(): Observable<ApiResponse<void>> {

        return this.http.post<ApiResponse<void>>(`${this.api}/auth/logout`, {})
        .pipe(
            tap(() => {
                this.accessToken = null
                this.router.navigate(['/login']);
            })
        )
    }

    rotateAuthTokens(): Observable<ApiResponse<string>> {
        return this.http.post<ApiResponse<string>>(`${this.api}/auth/refresh-token`, {}, {
            withCredentials: true
        });
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
