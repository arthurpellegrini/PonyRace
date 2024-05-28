// src/app/auth.service.ts
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { UserService } from './user.service';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;

  constructor(private apiService: ApiService, private userService: UserService) {}

  login(username: string, password: string): Observable<boolean> {
    return this.apiService.authenticateUser(username, password).pipe(
      map(response => {
        if (response && response.token) {
          this.userService.setToken(response.token);
          this.userService.setUsername(username);
          this.userService.setScore(response.money);
          this.isAuthenticated = true;
          return true;
        }
        return false;
      }),
      catchError(this.handleError)
    );
  }

  register(username: string, password: string, birthYear: number): Observable<boolean> {
    return this.apiService.registerUser(username, password, birthYear).pipe(
      map(response => {
        if (response && response.token) {
          this.userService.setToken(response.token);
          this.userService.setUsername(username);
          this.userService.setScore(response.money);
          this.isAuthenticated = true;
          return true;
        }
        return false;
      }),
      catchError(this.handleError)
    );
  }

  logout() {
    this.isAuthenticated = false;
    this.userService.clearUserData();
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      // Server-side error
      switch (error.status) {
        case 400:
          errorMessage = `Bad Request: ${error.error.message || 'The request was malformed'}`;
          break;
        case 401:
          errorMessage = 'Unauthorized: You need to be authenticated to access this resource';
          break;
        case 404:
          errorMessage = 'Not Found: The requested resource did not exist';
          break;
        case 417:
          errorMessage = `Expectation Failed: ${error.error.message || 'User already used'}`;
          break;
        default:
          errorMessage = `Server-side error: ${error.status} ${error.message}`;
          break;
      }
    }
    return throwError(errorMessage);
  }
}
