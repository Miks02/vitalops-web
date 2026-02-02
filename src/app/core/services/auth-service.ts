import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { inject } from '@angular/core';
import { RegisterRequest } from '../models/RegisterRequest';
import { AuthResponse } from '../models/AuthResponse';
import { Observable, map, tap } from 'rxjs';
import { UserDto } from '../models/UserDto';
import { LoginRequest } from '../models/LoginRequest';
import { Router } from '@angular/router';
import { UserService } from './user-service';
import { UpdatePasswordDto } from '../models/User/UpdatePasswordDto';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly api: string = "https://localhost:7263/api";
    private accessTokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('token'));
    public accessToken$ = this.accessTokenSubject.asObservable();

    private readonly http = inject(HttpClient)
    private router = inject(Router);
    private userService = inject(UserService);

    get accessToken(): string | null {return this.accessTokenSubject.value}
    set accessToken(accessToken: string | null) {
        this.accessTokenSubject.next(accessToken)

        if(accessToken === null)
            localStorage.removeItem('token')
        else
            localStorage.setItem('token', accessToken as string)
    }

    constructor() {
        this.accessTokenSubject.next(this.accessToken)
    }

    register(model: RegisterRequest): Observable<UserDto> {
        return this.http.post<AuthResponse>(`${this.api}/auth/register`, model, {withCredentials: true})
        .pipe(
            tap(res => {
                this.accessToken = res.accessToken;
                this.userService.userDetails = res.user;
                this.router.navigate(['/dashboard']);
            }),
            map(res => res.user)
        )
    }

    login(model: LoginRequest): Observable<UserDto> {
        return this.http.post<AuthResponse>(`${this.api}/auth/login`, model , {withCredentials: true})
        .pipe(
            tap(res => {
                this.accessToken = res.accessToken;
                this.userService.userDetails = res.user;
                this.router.navigate(['/dashboard']);
            }),
            map(res => res.user),
        )
    }

    changePassword(model: UpdatePasswordDto): Observable<void> {
        return this.http.post<void>(`${this.api}/auth/password`, model)
    }

    logout(): Observable<void> {

        return this.http.post<void>(`${this.api}/auth/logout`,{}, {withCredentials: true})
        .pipe(
            tap(() => {
                this.clearAuthData();
                this.router.navigate(['/login']);
            })
        )
    }

    rotateAuthTokens(): Observable<string> {
        return this.http.post<string>(`${this.api}/auth/refresh-token`, {}, {
            withCredentials: true
        });
    }

    test(): Observable<void> {
        return this.http.get<void>(`${this.api}/auth/test`).pipe(
            tap(res => console.log(res))
        );
    }

    isAuthenticated() {
        if(this.accessToken) return true;
        return false;
    }

    clearAuthData() {
        this.userService.resetCurrentUser();
        localStorage.removeItem('token');
        this.accessTokenSubject.next(null);
    }

}
