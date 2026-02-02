import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, of, tap } from 'rxjs';
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
    private urlOnly = environment.urlOnly;
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

    getMe() {

        if(!this.isUserLoaded) {
            return this.http.get<UserDetailsDto>(`${this.api}/users/me`)
            .pipe(
                tap((res) => {
                    this.userDetails = res;
                    if(res.imagePath !== null)
                        this.userDetails.imagePath = this.urlOnly + res.imagePath;
                })
            )
        }
        return of(this.userDetailsSubject.getValue() as UserDetailsDto);
    }

    deleteAccount() {
        return this.http.delete<void>(`${this.api}/users`)
    }

    deleteProfilePicture() {
        return this.http.delete<void>(`${this.api}/users/profile-picture`)
        .pipe(
            tap(() => {
                const next = this.mergeUserDetails({imagePath: null});
                this.userDetailsSubject.next(next)
            })
        )
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
            })
        );
    }

    updateEmail(email: UpdateEmailDto) {
        return this.http.patch<string>(`${this.api}/users/email`, email)
        .pipe(
            tap(res => {
                const next = this.mergeUserDetails({ email: res });
                this.userDetailsSubject.next(next);
            })
        );
    }

    updateDateOfBirth(dob: UpdateDateOfBirthDto) {
        return this.http.patch<string>(`${this.api}/users/date-of-birth`, dob)
        .pipe(
            tap(res => {
                const next = this.mergeUserDetails({ dateOfBirth: res });
                this.userDetailsSubject.next(next);
            })
        );
    }

    updateGender(gender: UpdateGenderDto) {
        return this.http.patch<Gender>(`${this.api}/users/gender`, gender)
        .pipe(
            tap(res => {
                const next = this.mergeUserDetails({ gender: res });
                this.userDetailsSubject.next(next);
            })
        );
    }

    updateHeight(height: UpdateHeightDto) {
        return this.http.patch<number>(`${this.api}/users/height`, height)
        .pipe(
            tap(res => {
                const next = this.mergeUserDetails({ height: res });
                this.userDetailsSubject.next(next);
            })
        );
    }

    updateTargetWeight(targetWeight: UpdateTargetWeightDto) {
        return this.http.patch<number>(`${this.api}/users/target-weight`, targetWeight)
        .pipe(
            tap(res => {
                const next = this.mergeUserDetails({ targetWeight: res });
                this.userDetailsSubject.next(next);
            })
        );
    }

    updateProfilePicture(imageFile: File) {
        const formData = new FormData();
        formData.append('imageFile', imageFile, imageFile.name);

        return this.http.patch(`${this.api}/users/profile-picture`, formData, {responseType: 'text'})
        .pipe(
            tap(res => {
                const next = this.mergeUserDetails({imagePath: this.urlOnly + res})
                this.userDetailsSubject.next(next);
            })
        )
    }

}
