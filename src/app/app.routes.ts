import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Acceuil } from './Element_Acceuil/acceuil/acceuil';
import { Dashboard } from './dashboard/dashboard';
import { Offres } from './offres/offres';
import { App } from './app';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
    { path: "", redirectTo: "accueil", pathMatch: "full" },
    { path: "login", component: Login },
    { path: "accueil", component: Acceuil },
    { path: "profile", component: Dashboard, canActivate: [AuthGuard] },
    { path: "offres", component: Offres, canActivate: [AuthGuard] }
];
