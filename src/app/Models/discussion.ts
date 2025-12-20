import { Client } from "./client";
import { Message } from "./message";
import { Teacher } from "./teacher";

export class Discussion {
    public Id: string = ''
    public Messages: Message[] = []
    public NomInterlocuteur!: string
    public IdInterlocuteur: string = '';
    public NomCreateur!: string
    public IdCreateur: string = '';
    public IdSuppresseurs: string[] = []

    constructor(interlocuteurs: string) {

        this.IdInterlocuteur = interlocuteurs;

    }
}
