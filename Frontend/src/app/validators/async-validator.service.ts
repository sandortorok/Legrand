import { Injectable } from '@angular/core';
import { AsyncValidator, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, map, catchError, of } from 'rxjs';
import { AuthService } from 'src/app/services/auth-service.service';

@Injectable({ providedIn: 'root' })
export class LoginValidator implements AsyncValidator {
    constructor(private authService: AuthService) { }

    validate(control: AbstractControl): Observable<ValidationErrors | null> {
        console.log(control.value);
        return this.authService.login(control.value).pipe(
            map((res) => {
                console.log(res);
                return (res ? { invalidCredentials: true } : null)
            }),
            catchError(() => of(null))
        );
    }
}