import { get, ref, set, remove, Database } from '@angular/fire/database';
import { inject, Injectable } from '@angular/core';
import { App } from '../app';
import { Contract } from '../Models/contract';

@Injectable({
    providedIn: 'root'
})
export class HandlerContract {
    tableContrat = inject(Database);
    refTableContrat: any;


    constructor() {
    }

    InitialiserTable(cleContrat?: string) {
        if (cleContrat) {
            this.refTableContrat = ref(this.tableContrat, `contracts/${App.connectedUserUid}/${cleContrat}`);
        }
        else {
            this.refTableContrat = ref(this.tableContrat, `contracts/${App.connectedUserUid}`);
        }

    }

    async sauvegarderContrat(contrat: Contract) {
        this.InitialiserTable();
        try {
            await this.refTableContrat.push(contrat);
            console.log(`Contrat sauvegardé avec succès : ${contrat.Id}`);
        }
        catch (error) {
            console.error('Erreur lors de la sauvegarde du contrat :', error);
        }
    }

    async obtenirContrats(): Promise<Record<string, Contract> | null> {
        this.InitialiserTable();
        const result = (await get(this.refTableContrat)).val() as Record<string, Contract> | null;
        return result;
    }

    async obtenirUnContrat(cleContrat: string): Promise<Contract | null> {
        this.InitialiserTable(cleContrat);
        const result = (await get(this.refTableContrat)).val() as Contract | null;
        return result;
    }

    async supprimerContrat(cleContrat: string) {
        this.InitialiserTable(cleContrat);
        await remove(this.refTableContrat);
    }



}
