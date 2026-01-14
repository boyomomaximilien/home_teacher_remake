import { Injectable, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword,onAuthStateChanged, createUserWithEmailAndPassword, signOut, User, setPersistence, browserLocalPersistence, browserSessionPersistence} from '@angular/fire/auth';
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

  async getUserState(): Promise<User | null> {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(this.auth, (user: User | null) => {
        unsubscribe();
        if (user) {
          console.log(`L'utilisateur ${user.email} est connecté. Redirection vers la page d'accueil.`);
          resolve(user);
        } else {
          resolve(null);
        }
      });
    });
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

  async Connexion(email: string, password: string, keepConnected: boolean): Promise<User | null> {

    try {

      await setPersistence(this.auth, keepConnected ? browserLocalPersistence : browserSessionPersistence)      
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
