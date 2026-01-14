import { ChangeDetectorRef, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Discussion } from '../../../Models/discussion';
import { App } from '../../../app';
import { Message } from '../../../Models/message';
import { FormsModule } from '@angular/forms';
import { HandlerDiscussion } from '../../../Handlers/handler-discussion';
import { Teacher } from '../../../Models/teacher';
import { Client } from '../../../Models/client';
import { Subscription, timer } from 'rxjs';

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
  tableDiscussion;
  public utilisateurConnecte!: Client | Teacher | null;
  private discussionSubscription: Subscription;

  constructor( private cdr: ChangeDetectorRef) {
    this.tableDiscussion = inject(HandlerDiscussion)
    this.discussionSubscription = timer(0, 5000).subscribe(() => {this.actualiserMessages(); console.log('les messages sont mises à jour');this.cdr.detectChanges() ;});
    
  }

  ngOnInit() {
    this.utilisateurConnecte = App.connectedUserDataBase
  }

  retourClicked() {
    this.retour.emit('discussion')
  }
  envoyerMessage(discussion: Discussion) {
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

  async actualiserMessages() {
    const discussionUpdated = await this.tableDiscussion.obtenirUneDiscussion(this.discussionSelect.Id)
    this.discussionSelect = discussionUpdated

  }

  ngOnDestroy() {
    if (this.discussionSubscription) {
      this.discussionSubscription.unsubscribe();
    }
  }

}
