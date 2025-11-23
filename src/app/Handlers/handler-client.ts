import { AngularFireList } from '@angular/fire/compat/database';
import { App } from '../app';
import { inject, Injectable } from '@angular/core';
import { ref, set, get, Database } from '@angular/fire/database';
import { Client } from '../Models/client';


@Injectable({
    providedIn: 'root',
})
export class HandlerClient {

    private clientTable = inject(Database);
    private pathClient!: string;
    clientRef: any;

    constructor() {

    }

    initialiserTable() {
        this.pathClient = `clients/${App.connectedUserUid}`;
        this.clientRef = ref(this.clientTable, this.pathClient);
    }

    async saveClient(client: Client) {
        this.initialiserTable()
        try {
            await set(this.clientRef, client);
            console.log(`Client sauvegardé avec succès : ${client.Name}`);
        }
        catch (error) {
            console.error('Erreur lors de la sauvegarde du client :', error);
        }
    }

    async getClientInfo() {
        this.initialiserTable()
        const result = await get(this.clientRef);
        return result.val() as Client;

    }


}
