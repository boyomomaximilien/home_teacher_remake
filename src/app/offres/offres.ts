import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { ListeContrats } from "./liste-contrats/liste-contrats";
import { ListeEnseignants } from "./liste-enseignants/liste-enseignants";
import { App } from '../app';
import { Teacher } from '../Models/teacher';
import { Contract } from '../Models/contract';
import { Database, ref, get } from '@angular/fire/database';
import { HandlerContract } from '../Handlers/handler-contract';
import { HandlerTeacher } from '../Handlers/handler-teacher';
import { Dashboard } from '../dashboard/dashboard';

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
  tableContrat;
  tableEnseignant;

  constructor(private cdr: ChangeDetectorRef) {
    this.tableContrat = inject(HandlerContract)
    this.tableEnseignant = inject(HandlerTeacher)

  }

  async ngOnInit() { 
    debugger
    if (App.connectedUserDataBase?.Nature === 'teacher') {
      this.isTeacher = true;
      this.contratsAffiche = await this.tableContrat.obtenirTousLesContratsDisponibles()
    }
    else {
      this.isTeacher = false;
      this.enseignantsAffiche = await this.tableEnseignant.getTousLesEnseignants()
    }
    this.cdr.detectChanges();
  }

  


}
