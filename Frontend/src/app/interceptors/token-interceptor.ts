import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth-service.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private _auth:AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let tokenizedReq = request.clone({
      setHeaders:{
        Authorization: `Bearer ${this._auth.getToken()}`
      }
    })
    return next.handle(tokenizedReq);
  }
}
