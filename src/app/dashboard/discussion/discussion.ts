import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-discussion',
  imports: [],
  templateUrl: './discussion.html',
  styleUrl: './discussion.css'
})
export class Discussion {

  @Output() showDiscussion = new EventEmitter();

  openDiscussion() {
    this.showDiscussion.emit('message');
  }

}
