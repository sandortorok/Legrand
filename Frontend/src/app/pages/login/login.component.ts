import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forbiddenNameValidator } from 'src/app/validators/forbidden-name.directive';
import { AuthService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginUserData = {username:"", password:""}
  invalidCredentials: Boolean = false;
  message: String;
  authForm!: FormGroup;

  constructor(private _auth: AuthService, private _router: Router) { }

  ngOnInit(): void {
    this.authForm = new FormGroup({
      username: new FormControl(this.loginUserData.username, [
        Validators.required,
        Validators.minLength(4),
        forbiddenNameValidator(/bob/i) // <-- Here's how you pass in the custom validator.
      ]),
      password: new FormControl(this.loginUserData.password),
    });
  
  }
  
  get username() { return this.authForm.get('username'); }

  get password() { return this.authForm.get('password'); }


  loginUser(){
    this._auth.login(this.authForm.value).subscribe({
      next: res => {
        this.invalidCredentials = false;
        localStorage.setItem('token', res['token']);
        this._router.navigate(['/lamps'])
      },
      error: err => {
        this.invalidCredentials = true;
        if(err.status === 401){
          this.message = "Rossz felhasználónév vagy jelszó"
        }
        else{
          this.message = "Az adatbázis nem elérhető"
        }
      }
    })
  }
}
