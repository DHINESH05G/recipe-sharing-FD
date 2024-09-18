import { NgForm } from '@angular/forms';
import { Component } from '@angular/core';
import { AuthResposeDate, AuthService } from './auth.service';
import { error } from 'console';
// @ts-ignore
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent {
  isLoginMode = false;
  isLoadning = false;
  error!: string;
  constructor(private authService: AuthService,private router:Router) {}
  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }
  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    this.isLoadning = true;
    let authObs!: Observable<AuthResposeDate>;
    if (this.isLoginMode) {
      authObs = this.authService.login(email, password);
    } else {
      authObs = this.authService.signup(email, password);
    }

    authObs.subscribe({
      next: (resData: AuthResposeDate) => {
        console.log(resData);
        this.isLoadning = false;
        this.router.navigate(['/recipes']);
      },
      error: (errorMessage: any) => {
        this.error = errorMessage;
        console.log(errorMessage);
        console.log(form.value);
        this.isLoadning = false;
      },
    });
    form.reset();
  }
}
