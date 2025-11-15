import { Component } from '@angular/core';

@Component({
  selector: 'app-liste-contrats',
  imports: [],
  templateUrl: './liste-contrats.html',
  styleUrl: './liste-contrats.css'
})
export class ListeContrats {
  contrats = [
    {
      studentName: 'Alice Mbappe',
      parentName: 'Mme. Mbappe',
      studentClasse: 'Terminale S',
      sessionTime: 2,
      matieres: ['Mathématiques', 'Physique'],
      ville: 'Douala',
      quartier: 'Bonanjo',
      montant: 40000
    },
    {
      studentName: 'Yann Nguema',
      parentName: 'M. Nguema',
      studentClasse: 'Première ES',
      sessionTime: 1.5,
      courseDay: ['Mardi', 'Vendredi'],
      Prix: 6500,
      datePaiement: new Date('2025-10-20')
    },
    {
      studentName: 'Fatou Diallo',
      parentName: 'Mme. Diallo',
      studentClasse: 'Seconde',
      sessionTime: 2,
      courseDay: ['Mercredi'],
      Prix: 7000,
      datePaiement: new Date('2025-10-25')
    }
  ];
}
