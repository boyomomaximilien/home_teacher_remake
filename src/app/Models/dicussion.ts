import { Client } from "./client";
import { Message } from "./message";
import { Teacher } from "./teacher";

export class Dicussion {
    public Id!: string;
    public Messages!: Message[]
    public People!: (Client | Teacher)[]
}
