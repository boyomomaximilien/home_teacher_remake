import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  formConnection = true;
  laRoute = new Router();

  alternerConnectionInscription() {
    this.formConnection = !this.formConnection;
  }

  logIn(name: string, paswword: string) {
  }

}
