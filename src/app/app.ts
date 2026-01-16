import { Component, inject, OnInit, Injector, ChangeDetectorRef } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Navbar } from "./navbar/navbar";
import { Myfooter } from "./myfooter/myfooter";
import { Teacher } from './Models/teacher';
import { Client } from './Models/client';
import { AuthFirebaseService } from './Handlers/auth-firebase-service';
import { HandlerClient } from './Handlers/handler-client';
import { HandlerTeacher } from './Handlers/handler-teacher';
import { GeminiAI } from './gemini-ai/gemini-ai';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, Myfooter,GeminiAI],
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
  geminiVisible: boolean = false;
  subscription: Subscription ;
  cdr = inject(ChangeDetectorRef);

  constructor() {
    this.authenticatorChecker = inject(AuthFirebaseService);
    this.laRoute = inject(Router);
    this.injector = inject(Injector);
    this.subscription = timer(0, 30000).subscribe(() => {this.updateConnectedUserData(); });
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

  openGeminiAI(){
    this.geminiVisible = !this.geminiVisible;
  }

  async updateConnectedUserData(){
    if(App.connectedUserDataBase?.Nature === 'client'){
      const client = await this.handlerClient?.getClientInfo(App.connectedUserUid);
      App.connectedUserDataBase = client as Client;

    }
    else if(App.connectedUserDataBase?.Nature === 'teacher'){
      const teacher = await this.handlerEnseignant?.getTeacherInfo(App.connectedUserUid);
      App.connectedUserDataBase = teacher as Teacher;
    }
    this.cdr.detectChanges();
  }

  ngOnDestroy(){
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }
}
