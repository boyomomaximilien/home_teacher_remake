import { Component } from '@angular/core';
import { Contrats } from "./contrats/contrats";
import { Messages } from "./discussion/messages/messages";
import { Profile } from "./profile/profile";
import { Discussion } from "./discussion/discussion";

@Component({
  selector: 'app-dashboard',
  imports: [Contrats, Profile, Discussion, Messages],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {

  public pageAffichee = 'contrat'
  message: any;

  displayedDashboard(name: string, listeDiscussions?: string[]) {

    if (listeDiscussions != null) {

    }
    this.pageAffichee = name

  }

  showAlert(name: string) {
    alert(name)
  }


}
