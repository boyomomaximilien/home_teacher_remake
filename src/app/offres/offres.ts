import { Component } from '@angular/core';
import { ListeContrats } from "./liste-contrats/liste-contrats";
import { ListeEnseignants } from "./liste-enseignants/liste-enseignants";
import { App } from '../app';

@Component({
  selector: 'app-offres',
  imports: [ListeContrats, ListeEnseignants],
  templateUrl: './offres.html',
  styleUrl: './offres.css'
})
export class Offres {
  isTeacher!: boolean;
  constructor() {

  }

  ngOnInit() {
    if (App.connectedUserUid !== '') {
      this.isTeacher = true;
    }
    else {
      this.isTeacher = false;
    }
  }

}
