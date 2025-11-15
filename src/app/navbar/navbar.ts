import { Component } from '@angular/core';
import { RouterLinkActive, RouterLink } from "@angular/router";
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [RouterLinkActive, RouterLink, NgIf],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  showContactDropdown = false;

  toggleContactDropdown() {
    this.showContactDropdown = !this.showContactDropdown;
  }

  reportAccount() {
    window.open('mailto:report@hometeacher.com?subject=Signalement%20compte%20dangereux', '_blank');
  }
}
