export class Teacher {
    public Id!: string;
    public Name!: string;
    public PassWord!: string;
    public Nature = 'teacher'
    public IsConnected!: boolean;
    public IsAdmin!: boolean;

    constructor(id: string, name: string, passWord: string, isConnected: boolean, isAdmin: boolean) {
        this.Id = id;
        this.Name = name;
        this.PassWord = passWord;
        this.IsConnected = isConnected;
        this.IsAdmin = isAdmin;

    }
}
