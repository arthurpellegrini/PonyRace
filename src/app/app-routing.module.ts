// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from "./register/register.component";
import { RacesComponent } from './races/races.component';
import { SingleraceComponent } from './singlerace/singlerace.component';
import { MoneyHistoryComponent } from "./money-history/money-history.component";
import {WatchRaceComponent} from "./watch-race/watch-race.component";

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'money-history', component: MoneyHistoryComponent, canActivate: [AuthGuard] },
  { path: 'races', component: RacesComponent, canActivate: [AuthGuard] },
  { path: 'single-race/:id', component: SingleraceComponent, canActivate: [AuthGuard]},
  { path: 'watch-race/:id', component: WatchRaceComponent, canActivate: [AuthGuard]},
  { path: '', redirectTo: 'races', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
