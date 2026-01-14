import { Component, Output, EventEmitter, inject, OnDestroy, Input } from '@angular/core';
import { Discussion } from '../../Models/discussion';
import { HandlerDiscussion } from '../../Handlers/handler-discussion';
import { App } from '../../app';
import { Client } from '../../Models/client';
import { Teacher } from '../../Models/teacher';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-discussion',
  imports: [],
  templateUrl: './discussion.html',
  styleUrl: './discussion.css'
})
export class DiscussionTemplate implements OnDestroy {

  @Output() showDiscussion = new EventEmitter<{ page: string, discussion: Discussion }>();
  @Input() touteMesDiscussion?: Discussion[];
  gestionnaireDiscussion = inject(HandlerDiscussion)
  public utilisateurConnecte!: Client | Teacher;
  private discussionSubscription: Subscription;

  constructor() {
    this.discussionSubscription = timer(0, 5000).subscribe(() => {this.recupererMesDiscussions(); console.log('Discussions mises à jour'); });
  }

  async ngOnInit() {
    if (App.connectedUserDataBase!== null) {
      this.utilisateurConnecte = App.connectedUserDataBase;
    }
  }

  async recupererMesDiscussions() {
    if (App.connectedUserDataBase?.ListDiscussionsUid !== undefined) {
      const listDiscussions = App.connectedUserDataBase?.ListDiscussionsUid;
      this.utilisateurConnecte = App.connectedUserDataBase;
      this.touteMesDiscussion = await this.gestionnaireDiscussion.obtenirToutesLesDiscussions(listDiscussions);
    }
  }


  openDiscussion(Id: string) {
    const data = {
      page: 'message',
      discussion: this.touteMesDiscussion?.find(discussion => discussion.Id === Id) as Discussion
    }
    this.showDiscussion.emit(data);
  }

  ngOnDestroy() {
    if (this.discussionSubscription) {
      this.discussionSubscription.unsubscribe();
    }
  }
}
