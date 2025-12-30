import { Injectable, OnInit, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User, user } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { App } from '../app';

@Injectable({
  providedIn: 'root',
})
export class AuthFirebaseService {

  private auth: Auth;

  constructor() {
    this.auth = inject(Auth);

  }


  async Enregistrement(email: string, password: string): Promise<User | null> {
    try {
      const UserCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      if (UserCredential.user) {
        App.connectedUserUid = UserCredential.user.uid;
        return UserCredential.user;

      }

    } catch (error) {

      return null;
    }

    return null;
  }

  async Connexion(email: string, password: string): Promise<User | null> {

    try {
      const UserCredential = await signInWithEmailAndPassword(this.auth, email, password);
      return UserCredential.user;
    }
    catch (error: any) {
      return null
    }
  }


  async deconnexion(): Promise<void> {
    try {
      await signOut(this.auth);
      App.connectedUserDataBase = null;
      App.connectedUserUid = '';
    } catch (error) {
    }
  }
}
