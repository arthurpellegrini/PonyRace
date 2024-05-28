import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from "@angular/router";
import { Observable, Subscription, interval } from "rxjs";
import { startWith, switchMap } from 'rxjs/operators';
import { RaceService } from "../race.service";
import { Race } from '../../models/race.model';

@Component({
  selector: 'app-races',
  templateUrl: './races.component.html',
  styleUrls: ['./races.component.css']
})
export class RacesComponent implements OnInit, OnDestroy {
  displayPendingRaces: boolean = true;
  nbSlices: number = 5;
  races$: Observable<Race[]> = this.raceService.getRaces();
  private timerSubscription: Subscription = new Subscription();

  constructor(protected raceService: RaceService, private router: Router) { }

  ngOnInit() {
    this.timerSubscription = interval(1000).pipe(
      startWith(0),
      switchMap(() => this.updateRaceList())
    ).subscribe();
  }

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  toggleRaceDisplay() {
    this.displayPendingRaces = !this.displayPendingRaces;
    this.updateRaceList().subscribe();
  }

  updateRaceList() {
    if (this.displayPendingRaces) {
      this.raceService.loadPendingRaces();
    } else {
      this.raceService.loadFinishedRaces();
    }
    return this.races$;
  }

  getTimeRemaining(startInstant: string): string {
    const startTime = new Date(startInstant).getTime();
    const now = Date.now();

    let timeDiff;
    if (this.displayPendingRaces) {
      timeDiff = startTime - now;
    } else {
      timeDiff = now - startTime;
    }

    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    if (this.displayPendingRaces)
      return `${minutes}m ${seconds}s`;
    else
      return `${minutes}m`;
  }

  betOnRace(id: number) {
    this.router.navigate(['single-race', id]).then(r => true);
  }
}
