import { inject, Injectable } from '@angular/core';
import { BehaviorSubject,  map,  Observable,  of,  switchMap,  switchMapTo,  tap } from 'rxjs';
import { UserDetailsDto } from '../models/UserDetailsDto';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { UpdateFullNameDto } from '../models/User/UpdateFullNameDto';
import { UpdateWeightDto } from '../models/User/UpdateWeightDto';
import { UpdateUserNameDto } from '../models/User/UpdateUserNameDto';
import { UpdateEmailDto } from '../models/User/UpdateEmailDto';
import { UpdateDateOfBirthDto } from '../models/User/UpdateDateOfBirthDto';
import { UpdateGenderDto } from '../models/User/UpdateGenderDto';
import { UpdateHeightDto } from '../models/User/UpdateHeightDto';
import { UpdateTargetWeightDto } from '../models/User/UpdateTargetWeightDto';
import { Gender } from '../models/Gender';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private api = environment.apiUrl;
    private userDetailsSubject = new BehaviorSubject<UserDetailsDto | null>(null);
    public userDetails$ = this.userDetailsSubject.asObservable();

    private http = inject(HttpClient);

    set userDetails(userDetails: Partial<UserDetailsDto>) {
        const currentUser = this.userDetailsSubject.getValue() as UserDetailsDto
        this.userDetailsSubject.next({...currentUser,...userDetails});
    }

    get userDetails() {
        return this.userDetailsSubject.getValue() as UserDetailsDto;
    }

    get isUserLoaded() {
        return this.userDetailsSubject.getValue() !== null;
    }

    private mergeUserDetails<T extends Partial<UserDetailsDto>>(patch: T): UserDetailsDto {
        const current = this.userDetailsSubject.getValue() ?? {} as UserDetailsDto;
        const next = { ...current, ...patch } as UserDetailsDto;
        return next;
    }

    resetCurrentUser() {
        this.userDetailsSubject.next(null);
    }

    getMe(): Observable<UserDetailsDto> {

        if(!this.isUserLoaded) {
            return this.http.get<UserDetailsDto>(`${this.api}/users/me`)
            .pipe(
                tap((res) => {
                    this.userDetails = res;
                    console.log("User fetched successfully")
                    console.log("USER: ", res);
                }),
                map((res) => {
                    return res;
                })
            )

        }
        console.log("User is already loaded");
        return  of(this.userDetailsSubject.getValue() as UserDetailsDto);

    }

    updateFullName(fullName: UpdateFullNameDto) {
        return this.http.patch<UpdateFullNameDto>(`${this.api}/users/fullname`, fullName )
        .pipe(
            tap((res) => {
                const next = this.mergeUserDetails({fullName: res.firstName + ' ' + res.lastName});
                this.userDetailsSubject.next(next)
            }),
            tap((res) => { console.log(res) })
        )
    }

    updateWeight(weight: UpdateWeightDto) {
        return this.http.patch<number>(`${this.api}/users/weight`, weight)
        .pipe(
            tap((res) => {
                const next = this.mergeUserDetails({currentWeight: res});
                this.userDetailsSubject.next(next)
            }),
        )
    }

    updateUserName(username: UpdateUserNameDto) {
        return this.http.patch<string>(`${this.api}/users/username`, username)
        .pipe(
            tap(res => {
                const next = this.mergeUserDetails({ userName: res });
                this.userDetailsSubject.next(next);
            }),
            tap(res => { console.log(res); })
        );
    }

    updateEmail(email: UpdateEmailDto) {
        return this.http.patch<string>(`${this.api}/users/email`, email)
        .pipe(
            tap(res => {
                const next = this.mergeUserDetails({ email: res });
                this.userDetailsSubject.next(next);
            }),
            tap(res => { console.log(res); })
        );
    }

    updateDateOfBirth(dob: UpdateDateOfBirthDto) {
        return this.http.patch<string>(`${this.api}/users/date-of-birth`, dob)
        .pipe(
            tap(res => {
                const next = this.mergeUserDetails({ dateOfBirth: res });
                this.userDetailsSubject.next(next);
            }),
            tap(res => { console.log(res); })
        );
    }

    updateGender(gender: UpdateGenderDto) {
        return this.http.patch<Gender>(`${this.api}/users/gender`, gender)
        .pipe(
            tap(res => {
                const next = this.mergeUserDetails({ gender: res });
                this.userDetailsSubject.next(next);
            }),
            tap(res => { console.log(res); })
        );
    }

    updateHeight(height: UpdateHeightDto) {
        return this.http.patch<number>(`${this.api}/users/height`, height)
        .pipe(
            tap(res => {
                const next = this.mergeUserDetails({ height: res });
                this.userDetailsSubject.next(next);
            }),
            tap(res => { console.log(res); })
        );
    }

    updateTargetWeight(targetWeight: UpdateTargetWeightDto) {
        return this.http.patch<number>(`${this.api}/users/target-weight`, targetWeight)
        .pipe(
            tap(res => {
                const next = this.mergeUserDetails({ targetWeight: res });
                this.userDetailsSubject.next(next);
            }),
            tap(res => { console.log(res); })
        );
    }



}
