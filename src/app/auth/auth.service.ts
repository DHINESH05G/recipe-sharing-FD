import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
// @ts-ignore
import { catchError, tap } from 'rxjs/operators';
// @ts-ignore
import { BehaviorSubject, throwError } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';

export interface AuthResposeDate {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registerd?: boolean;
}
@Injectable({ providedIn: 'root' })
export class AuthService {
  defaultUser!: User;
  user = new BehaviorSubject<User | null>(this.defaultUser);
  private tokenExiprationTimer: any;
  constructor(private http: HttpClient, private router: Router) {}
  signup(email: string, password: string) {
    return this.http
      .post<AuthResposeDate>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyByiBZFj170YECGJD7jgySGqvhYG5xTIdg',
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handelError),
        tap((resData: { email: string; localId: string; idToken: string; expiresIn: string | number; }) => {
          this.handelAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResposeDate>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyByiBZFj170YECGJD7jgySGqvhYG5xTIdg',
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handelError),
        tap((resData: { email: string; localId: string; idToken: string; expiresIn: string | number; }) => {
          this.handelAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }
  autoLogin() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const userDataString = window.localStorage.getItem('userData');
      if (userDataString) {
        let userData: {
          email: string;
          id: string;
          _token: string;
          _tokenExpirationDate: string;
        } = JSON.parse(userDataString);
        if (!userData) {
          return;
        }
        const loadedUser = new User(
          userData.email,
          userData.id,
          userData._token,
          new Date(userData._tokenExpirationDate)
        );
        if (loadedUser.token) {
          this.user.next(loadedUser);
          const expirationDuration =
            new Date(userData._tokenExpirationDate).getTime() -
            new Date().getTime();
          this.autoLogout(expirationDuration);
        }
      }
    }
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.tokenExiprationTimer) {
      clearTimeout(this.tokenExiprationTimer);
    }
    this.tokenExiprationTimer = null;
  }
  autoLogout(exiprationDuration: number) {
    this.tokenExiprationTimer = setTimeout(() => {
      this.logout();
    }, exiprationDuration);
  }
  private handelAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
    console.log('localStorage:' + localStorage.getItem('userData'));
    console.log(
      'User Loged:' + this.user.subscribe(),
      '>>>>userID:' + user.token
    );
  }
  private handelError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An error occurred. Please try again later!';
    console.log('ErrorMessage:' + errorRes.error.error.message);
    switch (errorRes.error.error.message) {
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'The user may have been deleted!';
        break;
      case 'EMAIL_EXISTS':
        errorMessage = 'This email already exists.';
        break;
      case 'INVALID_LOGIN_CREDENTIALS':
        errorMessage = 'This email or password in not correct.';
        break;
    }
    return throwError(() => errorMessage); // Return an Observable that emits the error message
  }
}
