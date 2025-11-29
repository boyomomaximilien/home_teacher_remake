import { Component, Inject } from '@angular/core';
import { App } from '../../app';
import { Teacher } from '../../Models/teacher';
import { Client } from '../../Models/client';
import { FormsModule } from '@angular/forms';
import { HandlerClient } from '../../Handlers/handler-client';
import { HandlerTeacher } from '../../Handlers/handler-teacher';

@Component({
  selector: 'app-profile',
  imports: [FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {
  currentUser!: Teacher | Client | null
  handlerClient = Inject(HandlerClient);
  handlerTeacher = Inject(HandlerTeacher);

  isActivate = false
  Nom!: string;
  DateNaissance!: string;
  MotDePasse!: string;
  Quartier!: string;
  Contact!: string;
  NumeroCNI!: string;

  constructor() {

    this.currentUser = App.connectedUserDataBase

  }

  ngOnInit() {
    debugger;
    this.Nom = this.currentUser?.Name || '';
    this.DateNaissance = this.currentUser?.DateNaissance || '';
    this.MotDePasse = this.currentUser?.PassWord || '';
    this.Quartier = this.currentUser?.Quartier || '';
    this.Contact = this.currentUser?.Contact || '';
    this.NumeroCNI = this.currentUser?.NumeroCNI || '';


  }

  activeModification() {
    this.isActivate = !this.isActivate
  }

  SauvegarderModifications() {
    debugger
    if (this.currentUser) {
      this.currentUser.DateNaissance = this.DateNaissance;
      this.currentUser.PassWord = this.MotDePasse;
      this.currentUser.Quartier = this.Quartier;
      this.currentUser.Contact = this.Contact;
      this.currentUser.NumeroCNI = this.NumeroCNI;

      if (this.currentUser.Nature === 'client') {
        this.handlerClient.saveClient(this.currentUser);
        App.connectedUserDataBase = this.currentUser;
        alert('Modifications sauvegardées avec succès !');
      }
      else if (this.currentUser.Nature === 'teacher') {
        this.handlerTeacher.saveTeacher(this.currentUser);
        App.connectedUserDataBase = this.currentUser;
        alert('Modifications sauvegardées avec succès !');
      }
    }
  }

}
