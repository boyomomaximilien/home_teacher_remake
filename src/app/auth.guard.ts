import { Injectable } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { App } from './app';

@Injectable({ providedIn: 'root' })
export class AuthGuard {
    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (App.connectedUserUid !== '') {
            return true;
        } else {
            this.router.navigate(['/login']);
            return false;
        }
    }
}
