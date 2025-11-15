import { AngularFireList, AngularFireDatabase } from '@angular/fire/compat/database';
import { App } from '../app';

export class HandlerTeacher {

    private readonly path = `/teachers/${App.connectedUser?.Id}`;
    clientRef: AngularFireList<any>;

    constructor(private dbClient: AngularFireDatabase) {
        this.clientRef = this.dbClient.list(this.path);
    }

}
