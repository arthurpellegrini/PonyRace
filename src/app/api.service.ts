// src/app/api.service.ts
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient, private userService: UserService) {}

  /* See the API documentation for more information:
   * https://ponyracer.ninja-squad.com/apidoc
   */
  private makeRequest(method: string, endpoint: string, body?: any, headers?: HttpHeaders): Observable<any> {
    const url = `${this.baseUrl}${endpoint}`;
    headers = headers || new HttpHeaders({ 'Content-Type': 'application/json' });

    const token = this.userService.getToken();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    switch (method.toLowerCase()) {
      case 'get':
        return this.http.get<any>(url, { headers });
      case 'post':
        return this.http.post<any>(url, body, { headers });
      case 'put':
        return this.http.put<any>(url, body, { headers });
      case 'delete':
        return this.http.delete<any>(url, { headers });
      default:
        throw new Error(`Unsupported request method: ${method}`);
    }
  }

  listUsers(): Observable<any> {
    return this.makeRequest('get', `/api/users`);
  }

  registerUser(login: string, password: string, birthYear: number): Observable<any> {
    return this.makeRequest('post', '/api/users', JSON.stringify({ login, password, birthYear }));
  }

  getUser(id: number): Observable<any> {
    return this.makeRequest('get', `/api/users/${id}`);
  }

  authenticateUser(login: string, password: string): Observable<any> {
    return this.makeRequest('post', '/api/users/authentication', JSON.stringify({ login, password }));
  }

  listFinishedRaces(): Observable<any> {
    return this.makeRequest('get', '/api/races?status=FINISHED');
  }

  listPendingRaces(): Observable<any> {
    return this.makeRequest('get', '/api/races?status=PENDING');
  }

  getRace(id: number): Observable<any> {
    return this.makeRequest('get', `/api/races/${id}`);
  }

  placeBet(raceId: number, ponyId: number): Observable<any> {
    return this.makeRequest('post', `/api/races/${raceId}/bets`, JSON.stringify({ ponyId }));
  }

  cancelBet(raceId: number): Observable<any> {
    return this.makeRequest('delete', `/api/races/${raceId}/bets`);
  }

  boostsPony(raceId: number, ponyId: number): Observable<any> {
    return this.makeRequest('post', `/api/races/${raceId}/boosts`, JSON.stringify({ ponyId }));
  }

  listMoneyHistory(): Observable<any> {
    return this.makeRequest('get', '/api/money/history');
  }
}
