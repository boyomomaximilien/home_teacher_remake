import { Component, inject } from '@angular/core';
import { RouterLinkActive, RouterLink, Router } from "@angular/router";
import { App } from '../app';
import { AuthFirebaseService } from '../Handlers/auth-firebase-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLinkActive, RouterLink, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  showContactDropdown = false;

  private authService = inject(AuthFirebaseService);
  private router = inject(Router);

  public get estConnecte(): boolean {
    return App.connectedUserUid !== '';
  }

  constructor() { }

  toggleContactDropdown() {
    this.showContactDropdown = !this.showContactDropdown;
  }

  reportAccount() {
    window.open('mailto:report@hometeacher.com?subject=Signalement%20compte%20dangereux', '_blank');
  }

  deconnexion() {
    this.authService.deconnexion();
    this.router.navigate(['/login']);
  }
}
