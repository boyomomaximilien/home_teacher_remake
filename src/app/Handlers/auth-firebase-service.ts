import { Injectable, OnInit, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User, user } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthFirebaseService {

  private auth: Auth = inject(Auth);
  constructor() {

  }


  async Enregistrement(email: string, password: string): Promise<User | null> {
    const UserCredential = await createUserWithEmailAndPassword(this.auth, email, password);
    if (UserCredential.user) {
      return UserCredential.user;

    }
    return null;
  }

  async Connexion(email: string, password: string): Promise<User | null> {
    debugger
    try {
      const UserCredential = await signInWithEmailAndPassword(this.auth, email, password);
      console.log('Utilisateur connecté :', UserCredential.user);
      return UserCredential.user;
    }
    catch (error) {
      console.error('Erreur lors de la connexion :', error);
      return null;
    }


  }


}
