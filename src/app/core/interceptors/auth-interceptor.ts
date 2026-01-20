import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { AuthService } from '../services/auth-service';
import { inject } from '@angular/core';
import { catchError, filter, Observable, switchMap, take, tap, throwError } from 'rxjs';

let isRefreshing: boolean = false;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService)
    let token = authService.accessToken;


    if(!token) {
        return next(req);
    }

    return next(addTokenHeader(req, token)).pipe(
        tap(res => console.log("Response: ", res)),
        catchError((error: any) => {
            console.log("Error happened ", error.status)
            if(error.status === 401) {
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
            authService.accessToken = null;
            return authService.rotateAuthTokens().pipe(
                switchMap((res): Observable<HttpEvent<any>> => {
                    isRefreshing = false;
                    const newToken = res;
                    authService.accessToken = newToken;
                    console.log("Response from handle401error: ", res)
                    return next(addTokenHeader(req, newToken))
                }),
                catchError((err) => {
                    isRefreshing = false;
                    console.log("Error from handle401error: ", err)
                    if(err.status == 401) {
                        return authService.logout().pipe(
                            switchMap(() => {
                                return throwError(() => err)
                            }),
                            catchError((err) => {
                                console.error("Error occurred while trying to refresh the token", err)
                                authService.clearAuthData();
                                return throwError(() => err)
                            })

                        )
                    }
                    return throwError(() => err)

                })
            )

        }

        return authService.accessToken$.pipe(
            filter(token => token != null),
            take(1),
            switchMap((token): Observable<HttpEvent<any>> => next(addTokenHeader(req, token)))
        )

    }

    function addTokenHeader(req: HttpRequest<any>, token: string) {
        return req.clone({
            setHeaders: {Authorization: `Bearer ${token}`},

        })
    }
