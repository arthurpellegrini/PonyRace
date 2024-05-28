import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { ApiService } from './api.service';
import { Pony, Race } from '../models/race.model';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RaceService {
  private racesSubject = new BehaviorSubject<Race[]>([]);
  private raceSubject = new BehaviorSubject<Race | null>(null);
  private betPonyId: number | undefined;
  private raceName!: string;

  constructor(private apiService: ApiService) {}

  getPonyImageUrl(color: string, boosted: boolean = false): string {
    return `https://ng-ponyracer.ninja-squad.com/images/pony-${color.toLowerCase()}${boosted ? '-rainbow' : ''}.gif`;
  }

  getRaces(): Observable<Race[]> {
    return this.racesSubject.asObservable();
  }

  getRace(): Observable<Race | null> {
    return this.raceSubject.asObservable();
  }

  loadPendingRaces() {
    this.apiService.listPendingRaces().pipe(
      tap((races: Race[]) => this.racesSubject.next(races)),
      catchError(error => {
        console.error('Failed to load pending races', error);
        return of([]);
      })
    ).subscribe();
  }

  loadFinishedRaces() {
    this.apiService.listFinishedRaces().pipe(
      tap((races: Race[]) => this.racesSubject.next(races)),
      catchError(error => {
        console.error('Failed to load finished races', error);
        return of([]);
      })
    ).subscribe();
  }

  loadRace(id: number) {
    this.apiService.getRace(id).pipe(
      tap((race: Race) => {
        this.raceName = race.name;
        this.raceSubject.next(race)
      }),
      catchError(error => {
        console.error('Failed to load race', error);
        return of(null);
      })
    ).subscribe();
  }

  getRaceName(): string {
    return this.raceName;
  }

  placeBet(raceId: number, ponyId: number): Observable<void> {
    return this.apiService.placeBet(raceId, ponyId).pipe(
      tap(() => {
        let race = this.raceSubject.value;
        if (race) {
          race.betPonyId = ponyId;
          this.betPonyId = ponyId;
          this.raceSubject.next(race);
        }
      }),
      catchError(error => {
        console.error('Failed to place bet', error);
        return of(undefined);
      })
    );
  }

  cancelBet(raceId: number): Observable<void> {
    return this.apiService.cancelBet(raceId).pipe(
      tap(() => {
        let race = this.raceSubject.value;
        if (race) {
          race.betPonyId = undefined;
          this.betPonyId = undefined;
          this.raceSubject.next(race);
        }
      }),
      catchError(error => {
        console.error('Failed to cancel bet', error);
        return of(undefined);
      })
    );
  }

  boostsPony(raceId: number, ponyId: number): Observable<void> {
    return this.apiService.boostsPony(raceId, ponyId).pipe(
      tap(() => {
        let race = this.raceSubject.value;
        if (race) {
          const ponyIndex = race.ponies.findIndex(pony => pony.id === ponyId);
          if (ponyIndex !== -1) {
            race.ponies[ponyIndex].boosted = true;
            this.raceSubject.next(race); // Notify subscribers of the change
          }
        }
      }),
      catchError(error => {
        console.error('Failed to boost pony', error);
        return of(undefined);
      })
    );
  }

  updateRace(updatedRace: Race): void {
    this.raceSubject.next(updatedRace);
  }

  getRaceStatus(): Observable<string | null> {
    return this.raceSubject.asObservable().pipe(
      map(race => race ? race.status : null)
    );
  }

  getBetPonyId(): number | undefined {
    return this.betPonyId;
  }

  getWinningPony(): Pony | null {
    const race = this.raceSubject.value;
    if (race && race.ponies.length > 0) {
      return race.ponies.reduce((prev, current) => {
        if (!current) {
          return prev;
        }
        return (prev?.position ?? 0) > (current.position ?? 0) ? prev : current;
      }, race.ponies[0]);
    }
    return null;
  }
}
