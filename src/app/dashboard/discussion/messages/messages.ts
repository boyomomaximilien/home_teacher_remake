import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Discussion } from '../../../Models/discussion';
import { App } from '../../../app';

@Component({
  selector: 'app-messages',
  imports: [],
  templateUrl: './messages.html',
  styleUrl: './messages.css'
})
export class Messages {

  @Input() discussionSelect!: Discussion;
  @Output() retour = new EventEmitter()
  public idUtilisateur = App.connectedUserUid

  constructor() {
  }

  ngOnInit(): void {

  }

  retourClicked() {
    this.retour.emit('discussion')
  }

}
