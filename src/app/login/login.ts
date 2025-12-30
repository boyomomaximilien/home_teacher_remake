import { Component, inject, HostListener, signal } from '@angular/core';
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

  afficherSpinner = signal(false);
  afficherErreurConnexion = signal(false);
  afficherErreurInscription = signal(false);

  mailLogin = '';
  passwordLogin = '';
  mailSignUp = '';
  passwordSignUp = '';
  passwordSignUpFirst = '';
  nomUser = '';
  prenomUser = '';
  contactUser = '';
  natureUser!: 'client' | 'enseignant';

  private AuthentificationService;
  private handlerClient;
  private handlerEnseignant;

  formConnection = true;
  laRoute;
  utilisateur!: Teacher | Client;

  constructor() {
    this.laRoute = inject(Router);
    this.AuthentificationService = inject(AuthFirebaseService);
    this.handlerClient = inject(HandlerClient);
    this.handlerEnseignant = inject(HandlerTeacher);

  }

  @HostListener('document:keydown.enter')
  onEnter() {
    if (this.formConnection && !this.afficherSpinner) {
      this.logIn(this.mailLogin, this.passwordLogin);
    }
  }

  alternerConnectionInscription() {
    this.formConnection = !this.formConnection;
  }

  //se connecter
  async logIn(mail: string, paswword: string) {
    this.afficherSpinner.set(true)
    try {
      const IsAUth = await this.AuthentificationService.Connexion(mail, paswword);
      if (IsAUth) {
        this.afficherErreurConnexion.set(false)
        App.connectedUserUid = IsAUth.uid

        //recherche des information dans les client et si rien n'est trouve dans les enseignants
        this.utilisateur = await this.handlerClient.getClientInfo() as Client;
        if (!this.utilisateur) {
          this.utilisateur = await this.handlerEnseignant.getTeacherInfo();
        }
        App.connectedUserDataBase = this.utilisateur;
        this.laRoute.navigate(['/profile']);
      }
      else {
        this.afficherErreurConnexion.set(true)
      }
    }
    catch (error) {
    }
    this.afficherSpinner.set(false)

  }

  //creer un nouveau compte
  async signUp(mail: string, password: string) {

    this.afficherSpinner.set(true)

    try {
      if (this.passwordSignUp == this.passwordSignUpFirst && this.mailSignUp !== '' && this.passwordSignUp !== '') {

        this.afficherErreurInscription.set(false)
        if (this.natureUser === 'client') {
          const IsAUth = await this.AuthentificationService.Enregistrement(mail, password);
          const client = new Client(`${IsAUth?.uid}`, `${this.nomUser.toLowerCase()} ${this.prenomUser.toLowerCase()}`, password, this.contactUser, this.mailSignUp);

          await this.handlerClient.saveClient(client);
          App.connectedUserDataBase = client
          this.laRoute.navigate(['/profile']);
        }
        else if (this.natureUser === 'enseignant') {
          const IsAUth = await this.AuthentificationService.Enregistrement(mail, password);
          const enseignant = new Teacher(`${IsAUth?.uid}`, `${this.nomUser.toLowerCase()} ${this.prenomUser.toLowerCase()}`, password, false, this.contactUser, this.mailSignUp);
          await this.handlerEnseignant.saveTeacher(enseignant);
          App.connectedUserDataBase = enseignant
          this.laRoute.navigate(['/profile']);
        }

      }
    }
    catch (error) {

      this.afficherErreurInscription.set(true)

    }
    this.afficherSpinner.set(false)

  }
}
