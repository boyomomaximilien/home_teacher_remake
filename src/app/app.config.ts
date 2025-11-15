import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireAuth } from '@angular/fire/compat/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCWYTNzRZHVVSsgl6z2Hlzskgz8lS5uX5Q",
  authDomain: "home-teacher-5a007.firebaseapp.com",
  projectId: "home-teacher-5a007",
  storageBucket: "home-teacher-5a007.firebasestorage.app",
  messagingSenderId: "1077402966645",
  appId: "1:1077402966645:web:a3ec307be13c3c8c69f63c",
  measurementId: "G-9WMLR057L8"
};


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes), provideClientHydration(withEventReplay()),
    importProvidersFrom([AngularFireModule.initializeApp(firebaseConfig), AngularFireDatabaseModule, AngularFireAuth]),
  ]
};
