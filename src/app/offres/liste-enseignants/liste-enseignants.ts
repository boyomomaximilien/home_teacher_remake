import { Component, Input } from '@angular/core';
import { Teacher } from '../../Models/teacher';

@Component({
  selector: 'app-liste-enseignants',
  imports: [],
  templateUrl: './liste-enseignants.html',
  styleUrl: './liste-enseignants.css'
})
export class ListeEnseignants {

  @Input() listeEnseignants!: Teacher[]
  enseignants = [
    {
      name: 'Jean Pierre',
      photo: 'personne_icone.png',
      experience: 8,
      matieres: ['Mathématiques', 'Physique'],
      ville: 'Douala',
      description: 'Passionné par la pédagogie, j’aide les élèves à progresser avec des méthodes adaptées.'
    },
    {
      name: 'Fatou Ndiaye',
      photo: '',
      experience: 5,
      matieres: ['Français', 'Anglais'],
      ville: 'Yaoundé',
      description: 'Enseignante dynamique, spécialisée dans l’accompagnement personnalisé.'
    },
    {
      name: 'M. Nguema',
      photo: '',
      experience: 12,
      matieres: ['SVT', 'Chimie'],
      ville: 'Libreville',
      description: 'Expert en sciences, je rends les matières accessibles et motivantes.'
    }
  ];
}
