import { Message } from "./message";

export class Discussion {
    public Id: string = ''
    public IdContratObjet: 'contact direct' | string = 'contact direct'
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
