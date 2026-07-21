import { Component, Input, inject } from '@angular/core';
import { Contract } from '../../Models/contract';
import { HandlerDiscussion } from '../../Handlers/handler-discussion';
import { Discussion } from '../../Models/discussion';
import { App } from '../../app';
import { HandlerTeacher } from '../../Handlers/handler-teacher';
import { Teacher } from '../../Models/teacher';
import { HandlerClient } from '../../Handlers/handler-client';
import { Dashboard } from '../../dashboard/dashboard';
import { HandlerContract} from '../../Handlers/handler-contract'

@Component({
  selector: 'app-liste-contrats',
  imports: [],
  templateUrl: './liste-contrats.html',
  styleUrl: './liste-contrats.css'
})
export class ListeContrats {

  @Input() listeContrat?: Contract[];
  discussion;
  teacher;
  client;
  contratsHandler;

  constructor() {
    this.discussion = inject(HandlerDiscussion);
    this.teacher = inject(HandlerTeacher);
    this.client = inject(HandlerClient);
    this.contratsHandler = inject(HandlerContract)

  }


  async contacterClient(IdClient: string) {
    if (!this.verificationDiscussionExistante(IdClient)) {

      const clientValue = await this.client.getClientInfo(IdClient)
      const laDiscussion = new Discussion(`${IdClient}`)
      laDiscussion.NomInterlocuteur = clientValue.Name
      laDiscussion.IdCreateur = App.connectedUserUid
      laDiscussion.NomCreateur = `${App.connectedUserDataBase?.Name}`
      const discussion = await this.discussion.sauvegarderDiscussion(laDiscussion)

      if (clientValue.ListDiscussionsUid === undefined) {
        clientValue.ListDiscussionsUid = []
      }
      if (!clientValue.ListDiscussionsUid.find(i => i === discussion.Id)) {
        clientValue.ListDiscussionsUid.push(discussion.Id)
      }

      this.client.updateClient(clientValue)

      if (App.connectedUserDataBase) {
        if (App.connectedUserDataBase.ListDiscussionsUid === undefined) {
          App.connectedUserDataBase.ListDiscussionsUid = []
        }
        const listDiscussions = App.connectedUserDataBase as Teacher
        if (!listDiscussions.ListDiscussionsUid.find(i => i === discussion.Id)) {
          listDiscussions.ListDiscussionsUid.push(discussion.Id)
        }

        this.teacher.saveTeacher(listDiscussions)
        App.connectedUserDataBase = listDiscussions
      }
    }
    else{
      console.log("La discussion existe déjà");
    }
    
  }

  verificationDiscussionExistante(clientUid: string): boolean {
      const discussionExiste = Dashboard.touteMesDiscussionGlobal.find(discussion => discussion.IdInterlocuteur === clientUid || discussion.IdCreateur === clientUid);
      if(discussionExiste){
        return true;
      } else {
        return false;
      }
  }

  accepterContrat(contrat:Contract){
    if(contrat.listePostulantsId == undefined){
      contrat.listePostulantsId = []
    }

    if(!contrat.listePostulantsId.includes(`${App.connectedUserUid}`) && contrat.listePostulantsId.length< 21){
      const absolutePath = `${contrat.IdCreator}/${contrat.Id}`
      contrat.nombrePostulants += 1      
      contrat.listePostulantsId?.push(App.connectedUserUid)
      this.contratsHandler.updateContrat(contrat, absolutePath)
    }
    else{
      console.log('vous etes deja dans la liste des postulants')
    }
    
  }
}
