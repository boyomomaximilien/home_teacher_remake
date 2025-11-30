import { Database, get, remove, set, ref, update } from '@angular/fire/database';
import { inject, Injectable } from '@angular/core';
import { App } from '../app';
import { Discussion } from '../Models/discussion';
import { Message } from '../Models/message';

@Injectable({
    providedIn: 'root'
})

export class HandlerDiscussion {
    private tableDiscussion = inject(Database);
    RefTableDiscussion: any;
    laDiscussion !: Discussion;

    constructor() {

    }

    InitialiserTable(cleDiscussion?: string) {
        //definition de la reference 
        if (cleDiscussion) {
            this.RefTableDiscussion = ref(this.tableDiscussion, `discussions/${App.connectedUserUid}/${cleDiscussion}`);
        }
        else {
            this.RefTableDiscussion = ref(this.tableDiscussion, `discussions/${App.connectedUserUid}`);
        }
    }

    async sauvegarderDiscussion(laDiscussion: Discussion) {

        this.InitialiserTable()
        //creation et recuperation de la cle de la discussion
        const newRef = await this.RefTableDiscussion.push()
        laDiscussion.Id = newRef.apiKey
        //sauvegarde de la discussion
        await newRef.set(laDiscussion)
    }

    async obtenirToutesLesDiscussions(): Promise<Discussion[]> {
        this.InitialiserTable();
        const resultIntermediaire = (await get(this.RefTableDiscussion)).val();
        const result = Object.values<Discussion>(resultIntermediaire);
        return result;

    }

    async obtenirUneDiscussion(laCle: string): Promise<Discussion> {
        this.InitialiserTable(laCle);
        const result = (await get(this.RefTableDiscussion)).val() as Discussion;
        return result;
    }

    async miseAJourDiscussion(laCle: string, leMessage: Message): Promise<Discussion> {
        //recuperation de la discussion
        this.laDiscussion = await this.obtenirUneDiscussion(laCle);

        this.laDiscussion.Messages.push(leMessage)
        await update(this.RefTableDiscussion, this.laDiscussion)
        return this.laDiscussion
    }

    async supprimerDiscussion(discussion: Discussion) {
        discussion.IdSuppresseurs.push(App.connectedUserUid)
        this.InitialiserTable(discussion.Id)
        await update(this.RefTableDiscussion, discussion)
    }


}
