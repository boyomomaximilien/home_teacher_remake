import { AngularFireList, AngularFireDatabase } from '@angular/fire/compat/database';
import { App } from '../app';
import { inject } from '@angular/core';

export class HandlerClient {

    private clientData = inject(AngularFireDatabase);

    constructor() {

    }

}
