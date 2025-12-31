import { HttpErrorResponse, HttpEvent, HttpEventType, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { AuthService } from '../services/auth-service';
import { inject } from '@angular/core';
import { BehaviorSubject, catchError, filter, Observable, switchMap, take, tap, throwError } from 'rxjs';

let isRefreshing: boolean = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null)

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService)
    let token = authService.accessToken;


    if(token) {
        const cloned = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
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

function handle401Error(req: any, next: any, authService: AuthService): Observable<HttpEvent<any>> {
    if(!isRefreshing) {
        isRefreshing = true;
        refreshTokenSubject.next(null);

        return authService.rotateAuthTokens().pipe(
            switchMap((res): Observable<HttpEvent<any>> => {
                isRefreshing = false;
                const newToken = res.data;
                refreshTokenSubject.next(newToken);

                return next(addTokenHeader(req, newToken))
            }),
            catchError((err) => {
                isRefreshing = false;
                authService.logout();
                return throwError(() => err);
            })
        )

    }

    return refreshTokenSubject.pipe(
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
