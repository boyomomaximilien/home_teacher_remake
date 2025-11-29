import { Client } from "./client";
import { Message } from "./message";
import { Teacher } from "./teacher";

export class Discussion {
    public Id!: string;
    public Messages!: Message[]
    public IdInterlocuteur!: string[]
    public IdSuppresseurs!: string[]

    constructor(id: string, messages: Message[], interlocuteurs: string[], idSuppresseur: string[]) {
        this.Id = id;
        this.Messages = messages;
        this.IdInterlocuteur = interlocuteurs;
        this.IdSuppresseurs = idSuppresseur;

    }
}
