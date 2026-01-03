import { HttpErrorResponse, HttpEvent, HttpEventType, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { AuthService } from '../services/auth-service';
import { inject } from '@angular/core';
import { catchError, filter, map, Observable, switchMap, take, tap, throwError } from 'rxjs';

let isRefreshing: boolean = false;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService)
    let token = authService.accessToken;


    if(token) {
        const cloned = req.clone(addTokenHeader(req, token));
        return next(cloned).pipe(
            tap(event => {
                if(event.type === HttpEventType.Response) {
                    console.log("Returned a response with status: ", event.status);
                }
            })

        );
    }

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            console.log("Error happened ", error.status)
            if(error.status == 401) {
                if(!token) {
                    return throwError(() => error)
                }
                if(req.url.includes('refresh-token')) {
                    authService.logout();
                    return throwError(() => error)
                }
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
                const newToken = res.data;
                authService.accessToken = newToken;

                return next(addTokenHeader(req, newToken))
            }),
            catchError((err) => {
                isRefreshing = false;
                authService.logout();
                return throwError(() => err);
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
        setHeaders: {Authorization: `Bearer ${token}`}
    })
}
