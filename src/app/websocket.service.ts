import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import webstomp, { Client, Message } from 'webstomp-client';
import { Observable } from 'rxjs';
import { RaceService } from './race.service';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private client: Client | null = null;
  private isConnected: boolean = false;

  constructor(private raceService: RaceService) { }

  private createClient(): void {
    this.client = webstomp.client(`${environment.wsBaseUrl}/ws`);
  }

  private connect(): Observable<void> {
    return new Observable(observer => {
      if (this.isConnected && this.client && this.client.connected) {
        observer.next();
        observer.complete();
      } else {
        if (!this.client || this.client.ws.readyState === WebSocket.CLOSING || this.client.ws.readyState === WebSocket.CLOSED) {
          this.createClient();
        }

        this.client?.connect({}, () => {
          this.isConnected = true;
          observer.next();
          observer.complete();
        }, (error) => {
          observer.error(error);
        });
      }
    });
  }

  public watchRace(raceId: number): Observable<any> {
    return new Observable(observer => {
      this.connect().subscribe({
        next: () => {
          const subscription = this.client!.subscribe("/race/" + raceId, (message: Message) => {
            const raceData = JSON.parse(message.body);
            this.raceService.updateRace(raceData);
            observer.next(raceData);
          });

          // Handle unsubscription
          return () => {
            subscription.unsubscribe();
          };
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }
}
