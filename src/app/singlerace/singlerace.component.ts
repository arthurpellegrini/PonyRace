import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import {Subscription, interval, of} from 'rxjs';
import { Race } from '../../models/race.model';
import { RaceService } from '../race.service';
import { catchError } from "rxjs/operators";

@Component({
  selector: 'app-singlerace',
  templateUrl: './singlerace.component.html',
  styleUrls: ['./singlerace.component.css']
})
export class SingleraceComponent implements OnInit, OnDestroy {
  race: Race | null = null;
  timeRemaining: string = '';
  private timerSubscription: Subscription = new Subscription();
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    protected raceService: RaceService
  ) {}

  ngOnInit() {
    const id = +this.route.snapshot.params['id'];
    this.raceService.loadRace(id);
    this.raceService.getRace().subscribe(race => {
      this.race = race;
      this.updateTimeRemaining();
      this.startTimer();
    });
  }

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  updateTimeRemaining() {
    if (this.race) {
      const startTime = new Date(this.race.startInstant).getTime();
      const now = Date.now();
      const timeDiff = startTime - now;

      if (timeDiff <= 0) {
        this.timeRemaining = 'Now!';
      } else {
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        this.timeRemaining = `${minutes}m ${seconds}s`;
      }
    }
  }

  startTimer() {
    this.timerSubscription = interval(1000).subscribe(() => {
      this.updateTimeRemaining();
    });
  }

  onBack() {
    this.router.navigate(['/races']).then(r => true);
  }

  betOnPony(ponyId: number) {
    if (!this.race) return;

    if (this.race.betPonyId === ponyId) {
      this.raceService.cancelBet(this.race.id).pipe(
        catchError((error) => {
          if (error.status === 417) {
            this.errorMessage = "The race is already started or finished";
          }
          return of(null);
        })
      ).subscribe(() => {
        if (this.race) this.race.betPonyId = undefined;
      });
    } else {
      this.raceService.placeBet(this.race.id, ponyId).pipe(
        catchError((error) => {
          if (error.status === 417) {
            this.errorMessage = "The race is already started or finished";
          }
          return of(null);
        })
      ).subscribe(() => {
        if (this.race && this.errorMessage === '') this.race.betPonyId = ponyId;
      });
    }
  }

  watchLive() {
    if (this.race) {
      this.router.navigate(['/watch-race', this.race.id]).then(r => true);
    }
  }
}
