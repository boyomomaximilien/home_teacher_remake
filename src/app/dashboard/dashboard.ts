import { Component, OnInit } from '@angular/core';
import { Contrats } from "./contrats/contrats";
import { Messages } from "./discussion/messages/messages";
import { Profile } from "./profile/profile";
import { DiscussionTemplate } from "./discussion/discussion";
import { Discussion } from '../Models/discussion';
import { Teacher } from '../Models/teacher';
import { Client } from '../Models/client';
import { App } from '../app';

@Component({
  selector: 'app-dashboard',
  imports: [Contrats, Profile, DiscussionTemplate, Messages],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {

  public pageAffichee = 'contrat';
  message: any;
  public utilisateurActuel!: Teacher | Client | null;
  public laDiscussion!: Discussion


  constructor() {
    this.utilisateurActuel = App.connectedUserDataBase;

  }

  displayedDashboard(data: string | { page: string, discussion: Discussion }) {

    if (typeof data === 'string') {
      this.pageAffichee = `${data}`

    }
    else {
      this.pageAffichee = data.page
      this.laDiscussion = data.discussion
    }


  }

  showAlert(name: string) {
    alert(name)
  }


}
