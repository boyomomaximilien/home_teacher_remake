import { Component, OnInit, inject } from '@angular/core';
import { Database, get, ref } from '@angular/fire/database';
import { Router } from '@angular/router';
import { App } from '../app';
import { AuthFirebaseService } from '../Handlers/auth-firebase-service';
import { HandlerContract } from '../Handlers/handler-contract';
import { HandlerTeacher } from '../Handlers/handler-teacher';
import { Client } from '../Models/client';
import { Contract } from '../Models/contract';
import { Discussion } from '../Models/discussion';
import { Teacher } from '../Models/teacher';

type AdminTab = 'vue' | 'clients' | 'enseignants' | 'contrats' | 'messages';

@Component({
  selector: 'app-admindashboard',
  imports: [],
  templateUrl: './admindashboard.html',
  styleUrl: './admindashboard.css',
})
export class Admindashboard implements OnInit {
  private database = inject(Database);
  private router = inject(Router);
  private authFirebase = inject(AuthFirebaseService);
  private handlerTeacher = inject(HandlerTeacher);
  private handlerContract = inject(HandlerContract);

  pageActive: AdminTab = 'vue';
  chargement = true;
  accesAutorise = false;
  erreurAcces = '';

  clients: Client[] = [];
  enseignants: Teacher[] = [];
  contrats: Contract[] = [];
  discussions: Discussion[] = [];

  async ngOnInit() {
    this.accesAutorise = await this.verifierAccesAdmin();

    if (!this.accesAutorise) {
      return;
    }

    await this.chargerDashboard();
  }

  async chargerDashboard() {
    this.chargement = true;
    this.erreurAcces = '';

    try {
      this.clients = (await this.lireCollection<Client>('clients')).map((client) => ({
        ...client,
        ListTeacherUid: client.ListTeacherUid || [],
        ListContratsUid: client.ListContratsUid || [],
        ListDiscussionsUid: client.ListDiscussionsUid || [],
      }));
      this.enseignants = (await this.handlerTeacher.getTousLesEnseignants()).map((enseignant) => ({
        ...enseignant,
        ListClientsUid: enseignant.ListClientsUid || [],
        ListContratsUid: enseignant.ListContratsUid || [],
        ListDiscussionsUid: enseignant.ListDiscussionsUid || [],
        ListMatiereDePredilection: enseignant.ListMatiereDePredilection || [],
      }));
      this.contrats = (await this.handlerContract.obtenirTousLesContratsDisponibles()).map((contrat) => ({
        ...contrat,
        courseDay: contrat.courseDay || [],
        matieres: contrat.matieres || [],
        nombrePostulants: contrat.nombrePostulants || 0,
      }));
      this.discussions = (await this.lireCollection<Discussion>('discussions')).map((discussion) => ({
        ...discussion,
        Messages: discussion.Messages || [],
      }));
    } catch (error) {
      this.erreurAcces =
        'Firebase refuse la lecture globale. Verifie les regles Database pour les comptes admin.';
      console.error('Erreur chargement dashboard admin :', error);
    } finally {
      this.chargement = false;
    }
  }

  ouvrirPage(page: AdminTab) {
    this.pageActive = page;
  }

  get contratsActifs() {
    return this.contrats.filter((contrat) => contrat.isAccepted);
  }

  get contratsEnAttente() {
    return this.contrats.filter((contrat) => !contrat.isAccepted);
  }

  get revenuPrevisionnel() {
    return this.contratsActifs.reduce((total, contrat) => total + Number(contrat.Prix || 0), 0);
  }

  get profilsIncomplets() {
    const clients = this.clients.filter((client) => !client.Contact || !client.Quartier || !client.NumeroCNI);
    const enseignants = this.enseignants.filter(
      (enseignant) =>
        !enseignant.Contact ||
        !enseignant.Quartier ||
        !enseignant.NumeroCNI ||
        enseignant.ListMatiereDePredilection.length === 0
    );

    return clients.length + enseignants.length;
  }

  get discussionsActives() {
    return this.discussions.filter((discussion) => discussion.Messages?.length > 0);
  }

  get contratsUrgents() {
    return this.contratsEnAttente.filter((contrat) => contrat.nombrePostulants >= 10);
  }

  get dernieresDiscussions() {
    return this.discussions.slice(-5).reverse();
  }

  get derniersContrats() {
    return this.contrats.slice(-5).reverse();
  }

  initiales(nom?: string) {
    return (nom || 'HT')
      .split(' ')
      .map((partie) => partie.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  nombreMessages(discussion: Discussion) {
    return discussion.Messages.length;
  }

  private async verifierAccesAdmin() {
    const user = await this.authFirebase.getUserState();

    if (!user) {
      this.router.navigate(['/login']);
      return false;
    }

    App.connectedUserUid = user.uid;
    const enseignant = await this.handlerTeacher.getTeacherInfo(user.uid);

    if (!enseignant?.IsAdmin) {
      this.router.navigate(['/profile']);
      return false;
    }

    App.connectedUserDataBase = enseignant;
    return true;
  }

  private async lireCollection<T>(chemin: string): Promise<T[]> {
    const snapshot = await get(ref(this.database, chemin));
    const valeur = snapshot.val() as Record<string, T> | null;
    return valeur ? Object.values(valeur) : [];
  }

}
