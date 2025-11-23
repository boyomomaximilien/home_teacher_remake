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
  public static connectedUserUid = '';
  public static connectedUserDataBase: Teacher | Client | null = null;

  constructor() {

  }

  ngOnInit(): void {
    // Initialisation à faire au démarrage du composant
  }
}
