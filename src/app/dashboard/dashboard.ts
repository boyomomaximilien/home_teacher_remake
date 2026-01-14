import { Component, OnInit, inject } from '@angular/core';
import { Contrats } from "./contrats/contrats";
import { AfficherMessages } from "./discussion/messages/messages";
import { Profile } from "./profile/profile";
import { DiscussionTemplate } from "./discussion/discussion";
import { Discussion } from '../Models/discussion';
import { Teacher } from '../Models/teacher';
import { Client } from '../Models/client';
import { App } from '../app';
import { HandlerDiscussion } from '../Handlers/handler-discussion';
import { HandlerContract } from '../Handlers/handler-contract';
import { Contract } from '../Models/contract';

@Component({
  selector: 'app-dashboard',
  imports: [Contrats, Profile, DiscussionTemplate, AfficherMessages],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {

  public pageAffichee = 'profile';
  public utilisateurActuel!: Teacher | Client | null;
  public laDiscussion!: Discussion

  touteMesDiscussion!: Discussion[];
  public static touteMesDiscussionGlobal: Discussion[];
  tousMesContrats!: Contract[];

  gestionnaireDiscussion;
  handlerContract;


  constructor() {
    this.gestionnaireDiscussion = inject(HandlerDiscussion)
    this.handlerContract = inject(HandlerContract)
  }

  async ngOnInit() {
    this.utilisateurActuel = App.connectedUserDataBase;
    await this.recupererMesDiscussions()
    await this.recupererContrat()

  }

  async recupererMesDiscussions() {
    if (App.connectedUserDataBase?.ListDiscussionsUid !== undefined) {
      const listDiscussions = App.connectedUserDataBase?.ListDiscussionsUid;
      this.touteMesDiscussion = await this.gestionnaireDiscussion.obtenirToutesLesDiscussions(listDiscussions);
      Dashboard.touteMesDiscussionGlobal = this.touteMesDiscussion
    }
    if (this.touteMesDiscussion === undefined) {
      this.touteMesDiscussion = []
      Dashboard.touteMesDiscussionGlobal = this.touteMesDiscussion
    }
  }

  async recupererContrat() {
    // 
    debugger
    if (App.connectedUserDataBase?.Nature=== 'client') {
      this.tousMesContrats = await this.handlerContract.obtenirContrats()
    }
    else if (App.connectedUserDataBase?.Nature === 'teacher') {
      if(App.connectedUserDataBase?.ListContratsUid !== undefined && App.connectedUserDataBase?.ListContratsUid !== null){
        this.tousMesContrats = []
        for (let contratUid of App.connectedUserDataBase.ListContratsUid) {
          const contrat = await this.handlerContract.obtenirUnContrat(undefined,contratUid);
          const contratExist= this.tousMesContrats.find(contrat => contrat.Id === contrat.Id);
          if(!contratExist ){
            this.tousMesContrats.push(contrat!);
          }          
        }
      }
    }    
  }

  displayedDashboard(data: string | { page: string, discussion: Discussion }) {

    if (typeof data === 'string') {
      this.pageAffichee = `${data}`

    }
    else {
      this.pageAffichee = data.page
      this.laDiscussion = data.discussion
    }


  }

  showAlert(name: string) {
    alert(name)
  }


}
