import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {
  isActivate = false

  activeModification() {
    this.isActivate = !this.isActivate
  }

}
