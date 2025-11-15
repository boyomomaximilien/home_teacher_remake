import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "./navbar/navbar";
import { Myfooter } from "./myfooter/myfooter";
import { Teacher } from './Models/teacher';
import { Client } from './Models/client';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Myfooter],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  protected title = 'Home_Teacher';
  public static connectedUser?: Teacher | Client;

  constructor() {
    // Simuler un utilisateur connecté (à remplacer par une logique réelle d'authentification)
    const fakeTeacher = new Teacher('T001', 'Jean Dupont', 'password123', true, false);
    const fakeClient = new Client('C001', 'Marie Client', 'clientpass', true);
    App.connectedUser = fakeTeacher;

  }

  ngOnInit(): void {
    // Initialisation à faire au démarrage du composant
  }
}
