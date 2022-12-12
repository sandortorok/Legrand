import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../services/auth-service.service';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private _authService: AuthService, private _router:Router){}

  canActivate():Observable<boolean>|boolean{
    return new Observable<boolean>(observer=>{
      console.log('checking');
      this._authService.verifyUser().subscribe({
        next: res=>{
          console.log(res);
          observer.next(true);
          observer.complete()
        },
        error: err =>{
          if(err instanceof HttpErrorResponse){
            if(err.status === 401){
              this._router.navigate(['/login'])
            }
            if(err.status === 404){
            }
          }
          observer.next(true);
          observer.complete()
        }
      })
    })
  }

}
