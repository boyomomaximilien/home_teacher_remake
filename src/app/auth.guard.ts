import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { App } from './app';

@Injectable({ providedIn: 'root' })
export class AuthGuard {
    constructor(private router: Router) {

    }

    canActivate(): boolean {
        if (App.connectedUserUid !== '') {
            return true;
        } else {
            this.router.navigate(['/login']);
            return false;
        }
    }
}
