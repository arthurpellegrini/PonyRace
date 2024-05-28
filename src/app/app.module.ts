import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AuthGuard } from "./auth.guard";
import { AppRoutingModule } from "./app-routing.module";
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { MenuComponent } from "./menu/menu.component";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { RacesComponent } from './races/races.component';
import { SingleraceComponent } from "./singlerace/singlerace.component";
import { MoneyHistoryComponent } from "./money-history/money-history.component";
import { AuthService } from "./auth.service";
import { UserService } from "./user.service";
import { WatchRaceComponent } from "./watch-race/watch-race.component";
import { WebSocketService } from "./websocket.service";
import { RaceService } from "./race.service";


@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    LoginComponent,
    RegisterComponent,
    MoneyHistoryComponent,
    RacesComponent,
    SingleraceComponent,
    WatchRaceComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [AuthService, UserService, AuthGuard, WebSocketService, RaceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
