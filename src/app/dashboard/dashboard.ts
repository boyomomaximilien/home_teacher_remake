import { Component, OnInit } from '@angular/core';
import { Contrats } from "./contrats/contrats";
import { Messages } from "./discussion/messages/messages";
import { Profile } from "./profile/profile";
import { Discussion } from "./discussion/discussion";
import { Teacher } from '../Models/teacher';
import { Client } from '../Models/client';
import { App } from '../app';

@Component({
  selector: 'app-dashboard',
  imports: [Contrats, Profile, Discussion, Messages],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {

  public pageAffichee = 'contrat';
  message: any;
  public utilisateurActuel!: Teacher | Client | null;


  constructor() {
    debugger;
    this.utilisateurActuel = App.connectedUserDataBase;

  }

  displayedDashboard(name: string, listeDiscussions?: string[]) {

    if (listeDiscussions != null) {

    }
    this.pageAffichee = name

  }

  showAlert(name: string) {
    alert(name)
  }


}
