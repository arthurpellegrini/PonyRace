import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WebSocketService } from '../websocket.service';
import { Subscription, interval } from 'rxjs';
import { RaceService } from '../race.service';
import { Race, Pony } from '../../models/race.model';
import {color} from "chart.js/helpers";

@Component({
  selector: 'app-watch-race',
  templateUrl: './watch-race.component.html',
  styleUrls: ['./watch-race.component.css']
})
export class WatchRaceComponent implements OnInit, OnDestroy {
  raceId!: number;
  ponies: any[] = [];
  raceSubscription!: Subscription;
  race: Race | null = null;
  raceName!: string;
  startInstant!: string;
  timeRemaining: string = '';
  winnerPony: Pony | null = null;
  private timerSubscription: Subscription = new Subscription();
  raceStatusSubscription: Subscription = new Subscription();
  isRaceFinished: boolean = false;
  betResult: string = '';

  constructor(
    private route: ActivatedRoute,
    private webSocketService: WebSocketService,
    protected raceService: RaceService
  ) { }

  ngOnInit(): void {
    this.raceId = +this.route.snapshot.params['id'];
    this.raceService.loadRace(this.raceId);
    this.raceService.getRace().subscribe(race => {
      this.race = race;
      if (this.race) {
        this.startInstant = this.race.startInstant;
        this.raceName = this.race.name;
        this.updateTimeRemaining();
        this.startTimer();
      }
    });
    this.subscribeToRaceUpdates(this.raceId);
    this.subscribeToRaceStatus();
  }

  ngOnDestroy(): void {
    this.unsubscribeFromRaceUpdates();
    this.unsubscribeFromTimer();
    this.raceStatusSubscription.unsubscribe();
  }

  private unsubscribeFromRaceUpdates(): void {
    if (this.raceSubscription) {
      this.raceSubscription.unsubscribe();
    }
  }

  private unsubscribeFromTimer(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  subscribeToRaceUpdates(raceId: number): void {
    this.unsubscribeFromRaceUpdates(); // Ensure previous subscription is cleaned up
    this.raceSubscription = this.webSocketService.watchRace(raceId).subscribe((data: any) => {
      this.ponies = data.ponies;
      this.raceService.updateRace(data); // Update race data in the service
    });
  }

  subscribeToRaceStatus(): void {
    this.raceStatusSubscription = this.raceService.getRaceStatus().subscribe(status => {
      if (status === 'FINISHED') {
        this.isRaceFinished = true;
        this.winnerPony = this.raceService.getWinningPony();
        this.checkBetResult();
      }
    });
  }

  updateTimeRemaining(): void {
    if (this.startInstant) {
      const startTime = new Date(this.startInstant).getTime();
      const now = Date.now();
      const timeDiff = startTime - now;

      if (timeDiff <= 0) {
        this.timeRemaining = 'Now!';
        this.unsubscribeFromTimer();
      } else {
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        this.timeRemaining = `${minutes}m ${seconds}s`;
      }
    }
  }

  startTimer(): void {
    this.unsubscribeFromTimer(); // Ensure previous timer is cleaned up
    this.timerSubscription = interval(1000).subscribe(() => {
      this.updateTimeRemaining();
    });
  }

  boostsPony(ponyId: number): void {
    const pony = this.ponies.find(p => p.id === ponyId);
    if (pony && pony.position < 100) {
      this.raceService.boostsPony(this.raceId, ponyId).subscribe();
    } else {
      console.log('Cannot boost pony. Pony has already reached position 100.');
    }
  }

  checkBetResult(): void {
    if (this.race && this.winnerPony) {
      if (this.winnerPony.id === this.raceService.getBetPonyId()) {
        this.betResult = 'Congratulations! You bet on the winning pony!';
      } else {
        this.betResult = 'Sorry, you did not bet on the winning pony.';
      }
    }
  }
}
