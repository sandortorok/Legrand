import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // private URL = "http://10.100.0.233:3000/auth"
  // private URL = "http://192.168.4.1:3000/auth"
  private URL = "http://localhost:3000/auth"
  constructor(private http:HttpClient, private _router: Router) { }

  registerUser(user){
    return this.http.post(this.URL + '/register', user)
  }
  login(user){
    return this.http.post(this.URL + '/login', user)
  }
  loggedIn(){
    return (!!localStorage.getItem('token'))
  }
  getToken(){
    return localStorage.getItem('token')
  }
  logoutUser(){
    localStorage.removeItem('token')
    this._router.navigate(['/login'])
  }
  isAdmin(){

  }
  verifyUser(){
    return this.http.get(this.URL + '/admin');
  }
}
