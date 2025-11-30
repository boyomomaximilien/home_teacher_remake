import { Component, Output, EventEmitter } from '@angular/core';
import { Discussion } from '../../Models/discussion';

@Component({
  selector: 'app-discussion',
  imports: [],
  templateUrl: './discussion.html',
  styleUrl: './discussion.css'
})
export class DiscussionTemplate {

  @Output() showDiscussion = new EventEmitter<{ page: string, discussion: Discussion }>();
  public touteMesDiscussion!: Discussion[]

  openDiscussion() {

    const data = {
      page: 'message',
      discussion: this.touteMesDiscussion[0]
    }
    this.showDiscussion.emit(data);
  }

}
