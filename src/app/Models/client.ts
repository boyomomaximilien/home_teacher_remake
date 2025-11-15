export class Client {
    public Id!: string;
    public Name!: string;
    public PassWord!: string;
    public Nature = 'client';
    public IsConnected!: boolean;

    constructor(id: string, name: string, passWord: string, isConnected: boolean) {
        this.Id = id;
        this.Name = name;
        this.PassWord = passWord;
        this.IsConnected = isConnected;
    }
}
