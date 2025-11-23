import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthFirebaseService } from '../Handlers/auth-firebase-service';
import { HandlerClient } from '../Handlers/handler-client';
import { App } from '../app';
import { Client } from '../Models/client';
import { Teacher } from '../Models/teacher';
import { HandlerTeacher } from '../Handlers/handler-teacher';

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
  private handlerClient = inject(HandlerClient);
  private handlerEnseignant = inject(HandlerTeacher);
  formConnection = true;
  laRoute = new Router();
  utilisateur!: Teacher | Client;

  alternerConnectionInscription() {
    this.formConnection = !this.formConnection;
  }

  //se connecter
  async logIn(mail: string, paswword: string) {
    const IsAUth = await this.AuthentificationService.Connexion(mail, paswword);
    if (IsAUth) {

      App.connectedUserUid = IsAUth.uid

      //recherche des information dans les client et si rien n'est trouve dans les enseignants
      this.utilisateur = await this.handlerClient.getClientInfo();
      if (!this.utilisateur) {
        this.utilisateur = await this.handlerEnseignant.getTeacherInfo();
      }
      App.connectedUserDataBase = this.utilisateur;
      this.laRoute.navigate(['/profile']);
    }
  }

  //creer un nouveau compte
  async signUp(mail: string, password: string) {

    if (this.passwordSignUp == this.passwordSignUpFirst) {

      if (this.natureUser === 'client') {
        const IsAUth = await this.AuthentificationService.Enregistrement(mail, password);
        const client = new Client(`${IsAUth?.uid}`, `${this.nomUser.toLowerCase()} ${this.prenomUser.toLowerCase()}`, password, true, this.contactUser, this.mailSignUp);
        await this.handlerClient.saveClient(client);
        this.laRoute.navigate(['/profile']);
      }
      else if (this.natureUser === 'enseignant') {
        const IsAUth = await this.AuthentificationService.Enregistrement(mail, password);
        const enseignant = new Teacher(`${IsAUth?.uid}`, `${this.nomUser.toLowerCase()} ${this.prenomUser.toLowerCase()}`, password, true, false, this.contactUser, this.mailSignUp);
        await this.handlerEnseignant.saveTeacher(enseignant);
        this.laRoute.navigate(['/profile']);
      }
      else {
        console.log('veuilliez choisir la nuture de votre profile')
      }

    }
  }
}
