export class Client {
    public Id!: string;
    public Name!: string;
    public PassWord!: string;
    public Contact!: string;
    public ListTeacherUid: string[] = [];
    public ListContratsUid: string[] = [];
    public ListDiscussionsUid: string[] = [];
    public Email!: string;
    public Nature = 'client';
    public Description: string = '';
    public DateNaissance: string = '';
    public Quartier: string = '';
    public NumeroCNI: string = '';


    constructor(id: string, name: string, passWord: string, contact: string, email: string) {
        this.Id = id;
        this.Name = name;
        this.Contact = contact;
        this.Email = email;
        this.PassWord = passWord;
    }
}
