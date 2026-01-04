import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { AuthService } from '../services/auth-service';
import { inject } from '@angular/core';
import { catchError, filter, map, Observable, switchMap, take, throwError } from 'rxjs';

let isRefreshing: boolean = false;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService)
    let token = authService.accessToken;


    if(!token) {
        return next(req);
    }

    return next(addTokenHeader(req, token)).pipe(
        catchError((error: any) => {
            console.log("Error happened ", error.status)
            if(error.status == 401) {
                return handle401Error(req, next, authService);
            }
            return throwError(() => error);
        })
    );
};

function handle401Error(
    req: HttpRequest<any>,
    next: HttpHandlerFn,
    authService: AuthService): Observable<HttpEvent<any>> {
        if(!isRefreshing) {
            isRefreshing = true;

            return authService.rotateAuthTokens().pipe(
                switchMap((res): Observable<HttpEvent<any>> => {
                    isRefreshing = false;
                    const newToken = res.data;
                    authService.accessToken = newToken;

                    return next(addTokenHeader(req, newToken))
                }),
                catchError((err) => {
                    isRefreshing = false;
                    return authService.logout().pipe(
                        switchMap(() => {
                            return throwError(() => err)
                        })
                    )
                })
            )

        }

        return authService.accessToken$.pipe(
            filter(token => token !== null),
            take(1),
            switchMap((token): Observable<HttpEvent<any>> => next(addTokenHeader(req, token)))
        )

    }

    function addTokenHeader(req: HttpRequest<any>, token: string) {
        return req.clone({
            setHeaders: {Authorization: `Bearer ${token}`},

        })
    }
