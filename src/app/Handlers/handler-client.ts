import { App } from '../app';
import { inject, Injectable } from '@angular/core';
import { ref, set, get, Database, remove, update } from '@angular/fire/database';
import { Client } from '../Models/client';


@Injectable({
    providedIn: 'root',
})
export class HandlerClient {

    private clientTable;
    private pathClient!: string;
    clientRef: any;

    constructor() {
        this.clientTable = inject(Database)

    }

    initialiserTable(id?: string) {
        if (id) {
            this.pathClient = `clients/${id}`;
            this.clientRef = ref(this.clientTable, this.pathClient);
        } else {
            this.pathClient = `clients/${App.connectedUserUid}`;
            this.clientRef = ref(this.clientTable, this.pathClient);
        }

    }

    //Sauvegarder client
    async saveClient(client: Client) {
        this.initialiserTable()
        try {
            await set(this.clientRef, client);
        }
        catch (error) {
            console.error('une Erreur', error)
        }
    }

    async updateClient(client: Client) {
        this.initialiserTable(client.Id)
        try {
            await update(this.clientRef, client);
        }
        catch (error) {
            console.error('une Erreur', error)
        }
    }

    // recuperer un client
    async getClientInfo(Id?: string) {
        if (Id) {
            this.pathClient = 'clients/' + Id;
            this.clientRef = ref(this.clientTable, this.pathClient);
            const client = await (await get(this.clientRef)).val() as Client
            return client
        }
        else {
            this.initialiserTable()
            const result = await get(this.clientRef);
            return result.val() as Client;
        }


    }

    //Supprimer un client
    async supprimerClient() {
        this.initialiserTable()
        await remove(this.clientRef);
    }


}
