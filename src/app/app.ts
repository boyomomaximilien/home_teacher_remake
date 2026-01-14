import { Component, inject, OnInit, Injector } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Navbar } from "./navbar/navbar";
import { Myfooter } from "./myfooter/myfooter";
import { Teacher } from './Models/teacher';
import { Client } from './Models/client';
import { AuthFirebaseService } from './Handlers/auth-firebase-service';
import { HandlerClient } from './Handlers/handler-client';
import { HandlerTeacher } from './Handlers/handler-teacher';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, Myfooter],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  protected title = 'Home_Teacher';
  public static connectedUserUid = '';
  public static connectedUserDataBase: Teacher | Client | null = null;
  private authenticatorChecker;
  private laRoute;
  private injector;
  handlerClient: HandlerClient | null = null;
  handlerEnseignant: HandlerTeacher | null = null;

  constructor() {
    this.authenticatorChecker = inject(AuthFirebaseService);
    this.laRoute = inject(Router);
    this.injector = inject(Injector);
  }

  async ngOnInit(){
    // Initialisation à faire au démarrage du composant
    this.handlerClient = this.injector.get(HandlerClient);
    this.handlerEnseignant = this.injector.get(HandlerTeacher);
    
    const user = await this.authenticatorChecker.getUserState();
    if(user){// Le mot de passe est vide car l'utilisateur est déjà authentifié
      App.connectedUserUid = user.uid;
      App.connectedUserDataBase = await this.handlerClient.getClientInfo() as Client;
        if (!App.connectedUserDataBase) {
          App.connectedUserDataBase = await this.handlerEnseignant.getTeacherInfo();
        }
        this.laRoute.navigate(['/profile']);
    }
  }
}
