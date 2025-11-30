import { Component, inject } from '@angular/core';
import { ListeContrats } from "./liste-contrats/liste-contrats";
import { ListeEnseignants } from "./liste-enseignants/liste-enseignants";
import { App } from '../app';
import { Teacher } from '../Models/teacher';
import { Contract } from '../Models/contract';
import { Database, ref, get } from '@angular/fire/database';

@Component({
  selector: 'app-offres',
  imports: [ListeContrats, ListeEnseignants],
  templateUrl: './offres.html',
  styleUrl: './offres.css'
})
export class Offres {
  isTeacher!: boolean;
  contratsAffiche !: Contract[]
  enseignantsAffiche !: Teacher[]
  dataBase = inject(Database)
  refDataBase: any;

  constructor() {

  }

  async ngOnInit() {

    if (App.connectedUserDataBase?.Nature === 'teacher') {
      this.isTeacher = true;
      this.refDataBase = ref(this.dataBase, 'contracts');
      this.contratsAffiche = Object.values<Contract>((await get(this.refDataBase)).val())
    }
    else {
      this.isTeacher = false;
      this.refDataBase = ref(this.dataBase, 'teacher')
      this.enseignantsAffiche = Object.values<Teacher>((await get(this.refDataBase)).val())
    }
  }


}
