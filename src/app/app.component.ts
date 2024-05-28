import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Course de Chevaux';
  numberOfUsers = 146;
  public name: string = 'Arthur';
  isAuth = false;

  constructor(private router: Router) {
    setTimeout(
      () => {
        this.isAuth = true;
      }, 4000
    );
    this.router.navigate(['races']);
  }

  onAllumer() {
    console.log('On allume tout !');
  }

}
