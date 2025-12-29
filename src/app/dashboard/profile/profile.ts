import { Component, inject } from '@angular/core';
import { App } from '../../app';
import { Teacher } from '../../Models/teacher';
import { Client } from '../../Models/client';
import { FormsModule } from '@angular/forms';
import { HandlerClient } from '../../Handlers/handler-client';
import { HandlerTeacher } from '../../Handlers/handler-teacher';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [FormsModule, CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {
  currentUser!: Teacher | Client | null
  handlerClient = inject(HandlerClient);
  handlerTeacher = inject(HandlerTeacher);

  isActivate = false
  Nom!: string;
  DateNaissance!: string;
  MotDePasse!: string;
  Quartier!: string;
  Contact!: string;
  NumeroCNI!: string;
  Description!: string;
  anneesExperience!: number;

  showConfirmationModal = false;
  showSuccessModal = false;

  constructor() {
    this.currentUser = App.connectedUserDataBase
  }

  ngOnInit() {
    if (this.currentUser) {
      if (this.currentUser.Nature === 'teacher') {
        const user = this.currentUser as Teacher;
        this.Nom = user.Name || '';
        this.DateNaissance = user.DateNaissance || '';
        this.MotDePasse = user.PassWord || '';
        this.Quartier = user.Quartier || '';
        this.Contact = user.Contact || '';
        this.NumeroCNI = user.NumeroCNI || '';
        this.Description = user.Description;
        this.anneesExperience = user.Experience;
      }
      else {
        const user = this.currentUser as Client;
        this.Nom = user.Name || '';
        this.DateNaissance = user.DateNaissance || '';
        this.MotDePasse = user.PassWord || '';
        this.Quartier = user.Quartier || '';
        this.Contact = user.Contact || '';
        this.NumeroCNI = user.NumeroCNI || '';
      }
    }
  }

  activeModification() {
    this.isActivate = !this.isActivate;
  }

  SauvegarderModifications() {
    this.showConfirmationModal = true;
  }

  cancelSaveChanges() {
    this.showConfirmationModal = false;
  }

  confirmSaveChanges() {
    if (this.currentUser) {
      this.currentUser.DateNaissance = this.DateNaissance;
      this.currentUser.PassWord = this.MotDePasse;
      this.currentUser.Quartier = this.Quartier;
      this.currentUser.Contact = this.Contact;
      this.currentUser.NumeroCNI = this.NumeroCNI;

      if (this.currentUser.Nature === 'client') {
        const client = this.currentUser as Client;
        this.handlerClient.updateClient(client);
        App.connectedUserDataBase = this.currentUser;
        this.showSuccessModal = true;
      }
      else if (this.currentUser.Nature === 'teacher') {
        const teacher = this.currentUser as Teacher;
        teacher.Description = this.Description
        this.handlerTeacher.saveTeacher(teacher);
        App.connectedUserDataBase = this.currentUser;
        this.showSuccessModal = true;
      }
    }
    this.showConfirmationModal = false;
    this.isActivate = false;
  }

  closeSuccessModal() {
    this.showSuccessModal = false;
  }
}
