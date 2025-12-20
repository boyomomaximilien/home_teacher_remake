import { get, ref, set, remove, Database, push, onValue } from '@angular/fire/database';
import { inject, Injectable } from '@angular/core';
import { App } from '../app';
import { Contract } from '../Models/contract';
import { Contrats } from '../dashboard/contrats/contrats';

@Injectable({
    providedIn: 'root'
})
export class HandlerContract {
    tableContrat = inject(Database);
    pathContrat!: string;
    refTableContrat: any;
    lesContratDisponibles: Contract[] = []


    constructor() {

    }
    // initialiser les information pour la reference sur firebase
    InitialiserTable(cleContrat?: string) {
        if (cleContrat) {
            this.pathContrat = `contrats/${App.connectedUserUid}/${cleContrat}`;
            this.refTableContrat = ref(this.tableContrat, this.pathContrat);
        }
        else {
            this.pathContrat = `contrats/${App.connectedUserUid}`;
            this.refTableContrat = ref(this.tableContrat, this.pathContrat);
        }

    }

    async sauvegarderContrat(contrat: Contract) {
        this.InitialiserTable();
        try {
            const nouvelleRef = await push(this.refTableContrat)
            contrat.Id = `${nouvelleRef.key}`;
            await set(nouvelleRef, contrat);
        }
        catch (error) {
        }
    }

    async obtenirContrats(): Promise<Contract[]> {
        this.InitialiserTable();
        const resultintermediaire = await (await get(this.refTableContrat)).val() as Record<string, Contract>;
        if (resultintermediaire) {
            const result = Object.values(resultintermediaire);
            return result;
        }

        return [];
    }

    async obtenirUnContrat(cleContrat: string): Promise<Contract | null> {
        this.InitialiserTable(cleContrat);
        const result = await (await get(this.refTableContrat)).val() as Contract | null;
        return result;
    }

    async supprimerContrat(cleContrat: string) {
        this.InitialiserTable(cleContrat);
        await remove(this.refTableContrat);
    }

    async obtenirTousLesContratsDisponibles(): Promise<Contract[]> {
        const path = 'contrats'
        this.refTableContrat = ref(this.tableContrat, path);
        const resultatBrute = await (await get(this.refTableContrat)).val() as Record<string, Record<string, Contract>>
        if (resultatBrute) {
            const resultatIntermediaire = Object.values(resultatBrute)
            resultatIntermediaire.forEach(element => {
                const leContrat = Object.values(element)[0]
                if (!this.lesContratDisponibles.find(contrat => contrat.Id == leContrat.Id)) {
                    this.lesContratDisponibles.push(leContrat)
                }
                else {
                    const index = this.lesContratDisponibles.findIndex(contrat => contrat.Id == leContrat.Id)
                    this.lesContratDisponibles[index] = leContrat
                }

            })

        }
        return this.lesContratDisponibles
    }



}
