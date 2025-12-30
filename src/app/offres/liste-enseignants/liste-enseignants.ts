import { Component, Input, inject } from '@angular/core';
import { Teacher } from '../../Models/teacher';
import { Discussion } from '../../Models/discussion';
import { HandlerTeacher } from '../../Handlers/handler-teacher';
import { HandlerDiscussion } from '../../Handlers/handler-discussion';
import { App } from '../../app';
import { Client } from '../../Models/client';
import { HandlerClient } from '../../Handlers/handler-client';

@Component({
  selector: 'app-liste-enseignants',
  imports: [],
  templateUrl: './liste-enseignants.html',
  styleUrl: './liste-enseignants.css'
})
export class ListeEnseignants {

  @Input() listeEnseignants?: Teacher[];
  gestionnaireEnseignant = inject(HandlerTeacher)
  gestionnaireDiscussion = inject(HandlerDiscussion)
  gestionnaireClient = inject(HandlerClient)


  constructor() {

  }

  async contactEnseignant(teacher: Teacher) {
    var discussion = new Discussion(teacher.Id);
    discussion.IdCreateur = App.connectedUserUid;
    discussion.NomCreateur = `${App.connectedUserDataBase?.Name}`;
    discussion.NomInterlocuteur = teacher.Name;
    discussion.IdInterlocuteur = teacher.Id;
    const saveDiscussion = await this.gestionnaireDiscussion.sauvegarderDiscussion(discussion);
    App.connectedUserDataBase?.ListDiscussionsUid.push(saveDiscussion.Id)
    await this.gestionnaireClient.updateClient(App.connectedUserDataBase as Client)
    const enseignant = await this.gestionnaireEnseignant.getTeacherInfo(teacher.Id)
    if (enseignant.ListDiscussionsUid == undefined) {
      enseignant.ListDiscussionsUid = []
    }
    enseignant.ListDiscussionsUid.push(discussion.Id)
    await this.gestionnaireEnseignant.saveTeacher(enseignant)

  }
}
