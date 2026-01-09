import { Database, get, set, ref, update, push, DataSnapshot } from '@angular/fire/database';
import { inject, Injectable } from '@angular/core';
import { App } from '../app';
import { Discussion } from '../Models/discussion';
import { Message } from '../Models/message';

@Injectable({
    providedIn: 'root'
})

export class HandlerDiscussion {
    private tableDiscussion;
    pathDiscussion!: string;
    RefTableDiscussion: any;
    laDiscussion !: Discussion;

    constructor() {
        this.tableDiscussion = inject(Database)

    }

    InitialiserTable(cleDiscussion?: string) {
        //definition de la reference 
        if (cleDiscussion) {
            this.pathDiscussion = 'discussions/' + cleDiscussion;
            this.RefTableDiscussion = ref(this.tableDiscussion, this.pathDiscussion);
        }
        else {
            this.pathDiscussion = 'discussions'
            this.RefTableDiscussion = ref(this.tableDiscussion, this.pathDiscussion);
        }
    }

    async sauvegarderDiscussion(laDiscussion: Discussion): Promise<Discussion> {
        this.InitialiserTable()
        //creation et recuperation de la cle de la discussion
        const newRef = await push(this.RefTableDiscussion)
        laDiscussion.Id = `${newRef.key}`
        await set(newRef, laDiscussion)
        return laDiscussion
    }

    async obtenirToutesLesDiscussions(discussionsId: string[]): Promise<Discussion[]> {
        var result: Discussion[] = []
        try{
            for (const element of discussionsId) {
            this.InitialiserTable(element)
            const laDiscussion = await (await get(this.RefTableDiscussion)).val() as Discussion
            result.push(laDiscussion)
        }
        return result;
        }
        catch(error){
            return result;
        }
        
        
    }

    async obtenirUneDiscussion(laCle: string): Promise<Discussion> {
        this.InitialiserTable(laCle);
        const result = await (await get(this.RefTableDiscussion)).val() as Discussion;
        return result;
    }

    async miseAJourDiscussion(discussion: Discussion, leMessage: Message): Promise<Discussion> {
        //recuperation de la discussion
        this.InitialiserTable(discussion.Id)
        if (!discussion.Messages) {
            discussion.Messages = []
        }
        discussion.Messages.push(leMessage)
        await set(this.RefTableDiscussion, discussion)
        return this.laDiscussion
    }

    async supprimerDiscussion(discussion: Discussion) {
        discussion.IdSuppresseurs.push(App.connectedUserUid)
        this.InitialiserTable(discussion.Id)
        await update(this.RefTableDiscussion, discussion)
    }


}
