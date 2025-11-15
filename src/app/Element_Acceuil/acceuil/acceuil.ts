import { Component } from '@angular/core';

@Component({
  selector: 'app-acceuil',
  imports: [],
  templateUrl: './acceuil.html',
  styleUrl: './acceuil.css'
})
export class Acceuil {
  listeMatiere = [
    {
      name: "Physique",
      icone: "images/matieres/logo_physique.png"
    },
    {
      name: "Chimie",
      icone: "images/matieres/chimie.jpeg"
    },
    {
      name: "Maths",
      icone: "images/matieres/maths_logo.png"
    },

    {
      name: "SVT",
      icone: "images/matieres/svt.jpeg"
    },
    {
      name: "Histoire",
      icone: "images/matieres/histoire.jpeg"
    },
    {
      name: "Geographie",
      icone: "images/matieres/geographie.jpeg"
    },
    {
      name: "Anglais",
      icone: "images/matieres/anglais.jpeg"
    },
    {
      name: "Français",
      icone: "images/matieres/francais.jpeg"
    },
    {
      name: "Allemand",
      icone: "images/matieres/allemand.jpeg"
    },
    {
      name: "Espagnol",
      icone: "images/matieres/espagnol.jpeg"
    },
    {
      name: "Informatique",
      icone: "images/matieres/informatique.jpeg"
    },
  ]

}
