export class Teacher {
    public Id!: string;
    public Name!: string;
    public PassWord!: string;
    public ListClientsUid: string[] = [];
    public ListContratsUid: string[] = [];
    public Nature = 'teacher'
    public IsConnected!: boolean;
    public IsAdmin!: boolean;
    public Contact!: string;
    public Email!: string;

    constructor(id: string, name: string, passWord: string, isConnected: boolean, isAdmin: boolean, contact: string, email: string) {
        this.Id = id;
        this.Name = name;
        this.PassWord = passWord;
        this.IsConnected = isConnected;
        this.IsAdmin = isAdmin;
        this.Contact = contact;
        this.Email = email;

    }
}
