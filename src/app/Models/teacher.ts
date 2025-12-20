export class Teacher {
    public Id!: string;
    public Name!: string;
    public PassWord!: string;
    public Ville: string = '';
    public Description: string = '';
    public Image: string = 'personne_icone.png';
    public Experience: number = 0;
    public ListDiscussionsUid: string[] = [];
    public ListClientsUid: string[] = [];
    public ListMatiereDePredilection: string[] = [];
    public ListContratsUid: string[] = [];
    public Nature = 'teacher'
    public IsAdmin: boolean;
    public Contact: string = '';
    public Email: string = '';
    public DateNaissance: string = '';
    public Quartier: string = '';
    public NumeroCNI: string = '';

    constructor(id: string, name: string, passWord: string, isAdmin: boolean, contact: string, email: string) {
        this.Id = id;
        this.Name = name;
        this.PassWord = passWord;
        this.IsAdmin = isAdmin;
        this.Contact = contact;
        this.Email = email;

    }
}
