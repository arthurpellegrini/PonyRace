// src/app/user.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private token: string | null = null;
  private username: string | null = null;
  private score: number | null = null;

  setToken(token: string) {
    this.token = token;
  }

  getToken(): string | null {
    return this.token;
  }

  clearToken() {
    this.token = null;
  }

  setUsername(username: string) {
    this.username = username;
  }

  getUsername(): string | null {
    return this.username;
  }

  clearUsername() {
    this.username = null;
  }

  setScore(score: number) {
    this.score = score;
  }

  getScore(): number | null {
    return this.score;
  }

  clearScore(){
    this.score = null;
  }

  clearUserData() {
    this.clearToken();
    this.clearUsername();
    this.clearScore();
  }
}
