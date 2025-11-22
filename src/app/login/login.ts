import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthFirebaseService } from '../Handlers/auth-firebase-service';
import { App } from '../app';
import { Client } from '../Models/client';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  mailLogin = '';
  passwordLogin = '';
  mailSignUp = '';
  passwordSignUp = '';
  passwordSignUpFirst = '';
  nomUser = '';
  prenomUser = '';
  contactUser = '';
  natureUser!: 'client' | 'enseignant';

  private AuthentificationService = inject(AuthFirebaseService);
  formConnection = true;
  laRoute = new Router();

  alternerConnectionInscription() {
    this.formConnection = !this.formConnection;
  }

  async logIn(mail: string, paswword: string) {
    debugger;
    const IsAUth = await this.AuthentificationService.Connexion(mail, paswword);
    if (IsAUth) {
      this.laRoute.navigate(['/profile']);
      App.connectedUserUid = IsAUth.uid
    }
    alert('Échec de la connexion. Vérifiez vos identifiants.');
  }

  async signUp(mail: string, paswword: string) {
    if (this.passwordSignUp !== this.passwordSignUpFirst) {
      if (this.natureUser === 'client') {
        const IsAUth = await this.AuthentificationService.Enregistrement(mail, paswword);
        const client = new Client(`${IsAUth?.uid}`, `${this.nomUser} ${this.prenomUser}`, paswword, true, this.contactUser, this.mailSignUp);
      }

    }
  }
}
