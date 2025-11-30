import { get, ref, set, remove, Database, push } from '@angular/fire/database';
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
            const nouvelleRef = await push(this.refTableContrat)
            contrat.Id = `${nouvelleRef.key}`;
            await set(nouvelleRef, contrat);
            console.log(`Contrat sauvegardé avec succès : ${contrat.Id}`);
        }
        catch (error) {
            console.error('Erreur lors de la sauvegarde du contrat :', error);
        }
    }

    async obtenirContrats(): Promise<Contract[]> {
        this.InitialiserTable();
        const resultintermediaire = (await get(this.refTableContrat)).val() as Record<string, Contract>;
        const result = Object.values(resultintermediaire);
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
