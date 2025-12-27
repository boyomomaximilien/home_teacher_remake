import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Discussion } from '../../../Models/discussion';
import { App } from '../../../app';
import { Message } from '../../../Models/message';
import { FormsModule } from '@angular/forms';
import { HandlerDiscussion } from '../../../Handlers/handler-discussion';
import { Teacher } from '../../../Models/teacher';
import { Client } from '../../../Models/client';

@Component({
  selector: 'app-messages',
  imports: [FormsModule],
  templateUrl: './messages.html',
  styleUrl: './messages.css'
})
export class AfficherMessages {

  @Input() discussionSelect!: Discussion;
  @Output() retour = new EventEmitter()
  textMessage!: string;
  tableDiscussion = inject(HandlerDiscussion)
  public utilisateurConnecte!: Client | Teacher | null;

  constructor() {
  }

  ngOnInit() {
    this.utilisateurConnecte = App.connectedUserDataBase

  }

  retourClicked() {
    this.retour.emit('discussion')
  }
  envoyerMessage(discussion: Discussion) {
    debugger
    if (!discussion.Messages) {
      discussion.Messages = []
    }
    var reciever = ''
    if (discussion.NomInterlocuteur === this.utilisateurConnecte?.Name) {
      reciever = discussion.NomCreateur
    }
    else {
      reciever = discussion.IdInterlocuteur
    }
    const date = new Date()
    const message = new Message('', this.textMessage, App.connectedUserUid, reciever, '', discussion.Id)
    message.Heure = `${date.toLocaleTimeString()}`
    message.Date = `${date.toLocaleDateString()}`
    this.tableDiscussion.miseAJourDiscussion(discussion, message)
    this.textMessage = ''
  }

  AttribuerContrat() {

  }

}
