import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideDatabase, getDatabase } from '@angular/fire/database';


const firebaseConfig = {
  apiKey: "AIzaSyCWYTNzRZHVVSsgl6z2Hlzskgz8lS5uX5Q",
  authDomain: "home-teacher-5a007.firebaseapp.com",
  databaseURL: "https://home-teacher-5a007-default-rtdb.firebaseio.com",
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
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
  ]
};
