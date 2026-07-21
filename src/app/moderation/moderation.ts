import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Database, ref, set, push, update } from '@angular/fire/database';
import { HandlerContract } from '../Handlers/handler-contract';
import { HandlerClient } from '../Handlers/handler-client';
import { HandlerTeacher } from '../Handlers/handler-teacher';
import { Contract } from '../Models/contract';
import { Client } from '../Models/client';
import { Teacher } from '../Models/teacher';
import { App } from '../app';

export interface UnifiedUser {
  id: string;
  name: string;
  email: string;
  contact: string;
  nature: 'client' | 'teacher';
  quartier?: string;
  ville?: string;
  experience?: number;
  isAdmin?: boolean;
  raw: Client | Teacher;
}

export type JourSemaine = 'lundi' | 'mardi' | 'mercredi' | 'jeudi' | 'vendredi' | 'samedi' | 'dimanche';

@Component({
  selector: 'app-moderation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './moderation.html',
  styleUrl: './moderation.css',
})
export class Moderation implements OnInit {
  private platformId = inject(PLATFORM_ID);
  private database = inject(Database);
  private contratsHandler = inject(HandlerContract);
  private clientHandler = inject(HandlerClient);
  private teacherHandler = inject(HandlerTeacher);

  // Données de base
  tousLesContrats: Contract[] = [];
  tousLesClients: Client[] = [];
  tousLesEnseignants: Teacher[] = [];
  tousLesUtilisateurs: UnifiedUser[] = [];

  // États d'interface
  loading: boolean = true;
  activeTab: 'overview' | 'users' | 'contracts' = 'overview';
  
  // Filtres
  searchQuery: string = '';
  userRoleFilter: 'all' | 'client' | 'teacher' = 'all';
  contractStatusFilter: 'all' | 'accepted' | 'pending' = 'all';

  // Élément sélectionné pour modal/détails
  selectedUser: UnifiedUser | null = null;
  selectedContract: Contract | null = null;
  notificationMessage: string | null = null;

  // Modale Création / Édition de contrat
  isFormModalOpen: boolean = false;
  isEditingForm: boolean = false;
  contractForm = {
    Id: '',
    IdCreator: '',
    studentName: '',
    studentClasse: '6ème',
    Prix: 30000,
    sessionTime: 2 as 1 | 2 | 3 | 4 | 5 | 6,
    courseDay: ['lundi', 'mercredi', 'vendredi'] as JourSemaine[],
    matieresInput: 'Mathématiques, Physique',
    parentName: '',
    studentPicture: 'personne_icone.png'
  };

  joursDisponibles: JourSemaine[] = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
  classesDisponibles: string[] = ['SIL / CP', 'CE1 / CE2', 'CM1 / CM2', '6ème', '5ème', '4ème', '3ème', 'Seconde', 'Première', 'Terminale', 'Universitaire'];

  // Modale Gestion des Postulants & Attribution
  isPostulantsModalOpen: boolean = false;
  selectedContractForPostulants: Contract | null = null;
  postulantsEnseignants: Teacher[] = [];

  async ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      await this.chargerDonnees();
    } else {
      this.loading = false;
    }
  }

  async chargerDonnees() {
    this.loading = true;
    try {
      const [contratsRes, clientsRes, teachersRes] = await Promise.allSettled([
        this.contratsHandler.getAllContrats(),
        this.clientHandler.getAllClient(),
        this.teacherHandler.getTousLesEnseignants()
      ]);

      if (contratsRes.status === 'fulfilled' && contratsRes.value) {
        const rawContrats = contratsRes.value;
        this.tousLesContrats = Array.isArray(rawContrats) 
          ? rawContrats 
          : Object.values(rawContrats as any);
      } else {
        this.tousLesContrats = [];
      }

      if (clientsRes.status === 'fulfilled' && clientsRes.value) {
        const rawClients = clientsRes.value;
        this.tousLesClients = Array.isArray(rawClients)
          ? rawClients
          : Object.values(rawClients as any);
      } else {
        this.tousLesClients = [];
      }

      if (teachersRes.status === 'fulfilled' && teachersRes.value) {
        const rawTeachers = teachersRes.value;
        this.tousLesEnseignants = Array.isArray(rawTeachers)
          ? rawTeachers
          : Object.values(rawTeachers as any);
      } else {
        this.tousLesEnseignants = [];
      }

      this.construireUtilisateursUnifies();
    } catch (error) {
      console.error('Erreur lors du chargement de la modération:', error);
      this.afficherNotification('Erreur de chargement des données.');
    } finally {
      this.loading = false;
    }
  }

  private construireUtilisateursUnifies() {
    const list: UnifiedUser[] = [];

    this.tousLesClients.forEach(c => {
      if (c && (c.Id || (c as any).id)) {
        list.push({
          id: c.Id || (c as any).id,
          name: c.Name || 'Client Inconnu',
          email: c.Email || 'Non renseigné',
          contact: c.Contact || 'Non renseigné',
          nature: 'client',
          quartier: c.Quartier,
          raw: c
        });
      }
    });

    this.tousLesEnseignants.forEach(t => {
      if (t && (t.Id || (t as any).id)) {
        list.push({
          id: t.Id || (t as any).id,
          name: t.Name || 'Enseignant Inconnu',
          email: t.Email || 'Non renseigné',
          contact: t.Contact || 'Non renseigné',
          nature: 'teacher',
          quartier: t.Quartier,
          ville: t.Ville,
          experience: t.Experience,
          isAdmin: t.IsAdmin,
          raw: t
        });
      }
    });

    this.tousLesUtilisateurs = list;
  }

  // Getters filtres
  get utilisateursFiltres(): UnifiedUser[] {
    return this.tousLesUtilisateurs.filter(user => {
      const matchRole = this.userRoleFilter === 'all' || user.nature === this.userRoleFilter;
      const q = this.searchQuery.toLowerCase().trim();
      const matchSearch = !q || 
        user.name.toLowerCase().includes(q) || 
        user.email.toLowerCase().includes(q) || 
        user.contact.toLowerCase().includes(q) ||
        (user.quartier && user.quartier.toLowerCase().includes(q));
      
      return matchRole && matchSearch;
    });
  }

  get contratsFiltres(): Contract[] {
    return this.tousLesContrats.filter(c => {
      const matchStatus = 
        this.contractStatusFilter === 'all' ||
        (this.contractStatusFilter === 'accepted' && c.isAccepted) ||
        (this.contractStatusFilter === 'pending' && !c.isAccepted);
      
      const q = this.searchQuery.toLowerCase().trim();
      const matchSearch = !q ||
        (c.studentName && c.studentName.toLowerCase().includes(q)) ||
        (c.studentClasse && c.studentClasse.toLowerCase().includes(q)) ||
        (c.parentName && c.parentName.toLowerCase().includes(q)) ||
        (c.matieres && c.matieres.some(m => m.toLowerCase().includes(q)));

      return matchStatus && matchSearch;
    });
  }

  // KPIs
  get totalContratsCount(): number {
    return this.tousLesContrats.length;
  }

  get contratsAcceptesCount(): number {
    return this.tousLesContrats.filter(c => c.isAccepted).length;
  }

  get totalClientsCount(): number {
    return this.tousLesClients.length;
  }

  get totalEnseignantsCount(): number {
    return this.tousLesEnseignants.length;
  }

  get totalVolumeFinancier(): number {
    return this.tousLesContrats.reduce((sum, c) => sum + (c.Prix || 0), 0);
  }

  // Actions Modales Formulaire (Créer / Éditer)
  ouvrirModalCreation() {
    this.isEditingForm = false;
    this.contractForm = {
      Id: '',
      IdCreator: App.connectedUserUid || 'admin_moderateur',
      studentName: '',
      studentClasse: '6ème',
      Prix: 35000,
      sessionTime: 2,
      courseDay: ['lundi', 'mercredi', 'vendredi'],
      matieresInput: 'Mathématiques, Physique',
      parentName: 'Parent Client',
      studentPicture: 'personne_icone.png'
    };
    this.isFormModalOpen = true;
  }

  ouvrirModalEdition(contract: Contract) {
    this.isEditingForm = true;
    this.contractForm = {
      Id: contract.Id,
      IdCreator: contract.IdCreator || App.connectedUserUid || 'admin_moderateur',
      studentName: contract.studentName || '',
      studentClasse: contract.studentClasse || '6ème',
      Prix: contract.Prix || 30000,
      sessionTime: contract.sessionTime || 2,
      courseDay: contract.courseDay ? [...contract.courseDay] : ['lundi', 'mercredi'],
      matieresInput: contract.matieres ? contract.matieres.join(', ') : '',
      parentName: contract.parentName || '-----',
      studentPicture: contract.studentPicture || 'personne_icone.png'
    };
    this.isFormModalOpen = true;
  }

  fermerModalForm() {
    this.isFormModalOpen = false;
  }

  toggleJour(jour: JourSemaine) {
    const idx = this.contractForm.courseDay.indexOf(jour);
    if (idx >= 0) {
      this.contractForm.courseDay.splice(idx, 1);
    } else {
      this.contractForm.courseDay.push(jour);
    }
  }

  isJourSelected(jour: JourSemaine): boolean {
    return this.contractForm.courseDay.includes(jour);
  }

  async sauvegarderContratForm() {
    if (!this.contractForm.studentName.trim()) {
      alert('Veuillez entrer le nom de l\'élève.');
      return;
    }

    const matieresArray = this.contractForm.matieresInput
      .split(',')
      .map(m => m.trim())
      .filter(m => m.length > 0);

    const creatorUid = this.contractForm.IdCreator || App.connectedUserUid || 'admin_moderateur';

    try {
      if (this.isEditingForm && this.contractForm.Id) {
        // Édition d'un contrat existant
        const contractRefPath = `contrats/${creatorUid}/${this.contractForm.Id}`;
        const updatedData = {
          studentName: this.contractForm.studentName,
          studentClasse: this.contractForm.studentClasse,
          Prix: Number(this.contractForm.Prix),
          sessionTime: this.contractForm.sessionTime,
          courseDay: this.contractForm.courseDay,
          matieres: matieresArray,
          parentName: this.contractForm.parentName,
          studentPicture: this.contractForm.studentPicture
        };

        await update(ref(this.database, contractRefPath), updatedData);

        // Mettre à jour localement
        const localIdx = this.tousLesContrats.findIndex(c => c.Id === this.contractForm.Id);
        if (localIdx >= 0) {
          Object.assign(this.tousLesContrats[localIdx], updatedData);
        }
        this.afficherNotification('Contrat mis à jour avec succès.');
      } else {
        // Création d'un nouveau contrat
        const creatorTableRef = ref(this.database, `contrats/${creatorUid}`);
        const newContractRef = push(creatorTableRef);
        const newId = newContractRef.key as string;

        const nouveauContratData: any = {
          Id: newId,
          IdCreator: creatorUid,
          studentName: this.contractForm.studentName,
          studentClasse: this.contractForm.studentClasse,
          studentPicture: this.contractForm.studentPicture,
          courseDay: this.contractForm.courseDay,
          sessionTime: this.contractForm.sessionTime,
          Prix: Number(this.contractForm.Prix),
          datePaiement: Date.now(),
          matieres: matieresArray,
          parentName: this.contractForm.parentName,
          IdAttributedTo: '',
          isAccepted: false,
          listePostulantsId: [],
          nombrePostulants: 0
        };

        await set(newContractRef, nouveauContratData);
        this.tousLesContrats.unshift(nouveauContratData);
        this.afficherNotification('Nouveau contrat créé avec succès.');
      }

      this.fermerModalForm();
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement du contrat', err);
      this.afficherNotification('Erreur lors de l\'enregistrement du contrat.');
    }
  }

  // Modale Postulants & Attribution
  voirPostulants(contract: Contract) {
    this.selectedContractForPostulants = contract;
    const postulantIds = contract.listePostulantsId || [];
    
    // Retrouver les profils enseignants correspondants
    this.postulantsEnseignants = this.tousLesEnseignants.filter(t => 
      t && (t.Id && postulantIds.includes(t.Id))
    );

    this.isPostulantsModalOpen = true;
  }

  fermerModalPostulants() {
    this.isPostulantsModalOpen = false;
    this.selectedContractForPostulants = null;
    this.postulantsEnseignants = [];
  }

  async attribuerContratAEnseignant(contract: Contract, teacher: Teacher) {
    if (!contract || !contract.Id) return;
    const creatorUid = contract.IdCreator || App.connectedUserUid || 'admin_moderateur';

    if (confirm(`Attribuer officiellement ce contrat à l'enseignant ${teacher.Name} ?`)) {
      try {
        const contractRefPath = `contrats/${creatorUid}/${contract.Id}`;
        const updateData = {
          IdAttributedTo: teacher.Id,
          isAccepted: true
        };

        await update(ref(this.database, contractRefPath), updateData);

        // Mettre à jour l'objet local
        contract.IdAttributedTo = teacher.Id;
        contract.isAccepted = true;

        this.afficherNotification(`Contrat attribué avec succès à ${teacher.Name} !`);
        this.fermerModalPostulants();
      } catch (err) {
        console.error('Erreur lors de l\'attribution du contrat', err);
        this.afficherNotification('Erreur lors de l\'attribution du contrat.');
      }
    }
  }

  // Actions consultation & suppression
  voirDetailsUtilisateur(user: UnifiedUser) {
    this.selectedUser = user;
  }

  fermerModalUtilisateur() {
    this.selectedUser = null;
  }

  voirDetailsContrat(contract: Contract) {
    this.selectedContract = contract;
  }

  fermerModalContrat() {
    this.selectedContract = null;
  }

  async supprimerContrat(contract: Contract) {
    if (!contract.Id) return;
    const creatorUid = contract.IdCreator || App.connectedUserUid || 'admin_moderateur';
    if (confirm(`Êtes-vous sûr de vouloir supprimer le contrat de ${contract.studentName} ?`)) {
      try {
        const contractRefPath = `contrats/${creatorUid}/${contract.Id}`;
        await set(ref(this.database, contractRefPath), null);
        this.tousLesContrats = this.tousLesContrats.filter(c => c.Id !== contract.Id);
        this.afficherNotification('Contrat supprimé avec succès.');
        if (this.selectedContract?.Id === contract.Id) {
          this.selectedContract = null;
        }
      } catch (err) {
        console.error('Erreur lors de la suppression du contrat', err);
        this.afficherNotification('Erreur lors de la suppression.');
      }
    }
  }

  afficherNotification(msg: string) {
    this.notificationMessage = msg;
    setTimeout(() => {
      this.notificationMessage = null;
    }, 4000);
  }
}
