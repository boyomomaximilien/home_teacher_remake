import { Component, Input, inject } from '@angular/core';
import { Contract } from '../../Models/contract';
import { HandlerDiscussion } from '../../Handlers/handler-discussion';
import { Discussion } from '../../Models/discussion';
import { App } from '../../app';
import { HandlerTeacher } from '../../Handlers/handler-teacher';
import { Teacher } from '../../Models/teacher';
import { HandlerClient } from '../../Handlers/handler-client';

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

  constructor() {
    this.discussion = inject(HandlerDiscussion);
    this.teacher = inject(HandlerTeacher);
    this.client = inject(HandlerClient)

  }


  async contacterClient(IdClient: string) {
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
}
