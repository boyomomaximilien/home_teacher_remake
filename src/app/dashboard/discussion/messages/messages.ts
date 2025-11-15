import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-messages',
  imports: [],
  templateUrl: './messages.html',
  styleUrl: './messages.css'
})
export class Messages {

  @Input() discussionSelect!: Messages[];
  @Output() retour = new EventEmitter()

  retourClicked() {
    this.retour.emit('discussion')
  }

}
