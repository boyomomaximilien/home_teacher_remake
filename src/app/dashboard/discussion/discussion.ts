import { Component, Output, EventEmitter, inject } from '@angular/core';
import { Discussion } from '../../Models/discussion';
import { HandlerDiscussion } from '../../Handlers/handler-discussion';

@Component({
  selector: 'app-discussion',
  imports: [],
  templateUrl: './discussion.html',
  styleUrl: './discussion.css'
})
export class DiscussionTemplate {

  @Output() showDiscussion = new EventEmitter<{ page: string, discussion: Discussion }>();
  public touteMesDiscussion!: Discussion[]
  gestionnaireDiscussion = inject(HandlerDiscussion)

  async ngOnInit() {
    this.touteMesDiscussion = await this.gestionnaireDiscussion.obtenirToutesLesDiscussions()
  }
  openDiscussion() {

    const data = {
      page: 'message',
      discussion: this.touteMesDiscussion[0]
    }
    this.showDiscussion.emit(data);
  }

}
