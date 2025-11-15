import { AngularFireList, AngularFireDatabase } from '@angular/fire/compat/database';
import { App } from '../app';

export class HandlerContract {

    private readonly path = `/contracts/${App.connectedUser?.Id}`;
    clientRef: AngularFireList<any>;

    constructor(private dbClient: AngularFireDatabase) {
        this.clientRef = this.dbClient.list(this.path);
    }

}
